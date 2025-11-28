# doctors/admin_views.py
from datetime import datetime, date, timedelta

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages

from accounts.decorators import admin_required
from .models import Doctor, WorkingDay, DoctorHoliday, Schedule
from .forms import DoctorForm, WorkingDayForm, DoctorHolidayForm, SlotGenerationForm


# --------------------
# Dashboard (FR12 – admin login + genel görünüm)
# --------------------
@admin_required
def admin_dashboard(request):
    doctor_count = Doctor.objects.count()
    total_slots = Schedule.objects.count()
    upcoming_slots = Schedule.objects.filter(date__gte=date.today()).count()

    context = {
        "doctor_count": doctor_count,
        "total_slots": total_slots,
        "upcoming_slots": upcoming_slots,
    }
    return render(request, "admin_panel/dashboard.html", context)


# --------------------
# Doctor CRUD (FR13)
# --------------------
@admin_required
def doctor_list(request):
    doctors = Doctor.objects.select_related("user", "clinic").all()
    return render(request, "admin_panel/doctor_list.html", {"doctors": doctors})


@admin_required
def doctor_create(request):
    if request.method == "POST":
        form = DoctorForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Doctor başarıyla eklendi.")
            return redirect("admin_doctors:doctor_list")
    else:
        form = DoctorForm()
    return render(request, "admin_panel/doctor_form.html", {"form": form, "mode": "add"})


@admin_required
def doctor_update(request, pk):
    doctor = get_object_or_404(Doctor, pk=pk)
    if request.method == "POST":
        form = DoctorForm(request.POST, instance=doctor)
        if form.is_valid():
            form.save()
            messages.success(request, "Doctor bilgileri güncellendi.")
            return redirect("admin_doctors:doctor_list")
    else:
        form = DoctorForm(instance=doctor)
    return render(request, "admin_panel/doctor_form.html", {"form": form, "mode": "edit", "doctor": doctor})


@admin_required
def doctor_delete(request, pk):
    doctor = get_object_or_404(Doctor, pk=pk)
    if request.method == "POST":
        doctor.delete()
        messages.success(request, "Doctor silindi.")
        return redirect("admin_doctors:doctor_list")
    return render(request, "admin_panel/doctor_confirm_delete.html", {"doctor": doctor})


# --------------------
# WorkingDay yönetimi (FR14 – çalışma saatleri)
# --------------------
@admin_required
def workingday_list(request, doctor_id):
    doctor = get_object_or_404(Doctor, pk=doctor_id)
    working_days = doctor.working_days.all()
    return render(request, "admin_panel/workingday_list.html", {
        "doctor": doctor,
        "working_days": working_days,
    })


@admin_required
def workingday_create(request, doctor_id):
    doctor = get_object_or_404(Doctor, pk=doctor_id)
    if request.method == "POST":
        form = WorkingDayForm(request.POST)
        if form.is_valid():
            wd = form.save(commit=False)
            wd.doctor = doctor
            wd.save()
            messages.success(request, "Çalışma günü eklendi.")
            return redirect("admin_doctors:workingday_list", doctor_id=doctor.id)
    else:
        form = WorkingDayForm()
    return render(request, "admin_panel/workingday_form.html", {"form": form, "doctor": doctor})


@admin_required
def workingday_delete(request, pk):
    wd = get_object_or_404(WorkingDay, pk=pk)
    doctor_id = wd.doctor.id
    if request.method == "POST":
        wd.delete()
        messages.success(request, "Çalışma günü silindi.")
        return redirect("admin_doctors:workingday_list", doctor_id=doctor_id)
    return render(request, "admin_panel/workingday_confirm_delete.html", {"workingday": wd})


# --------------------
# Holiday yönetimi (FR14 – izin/tatil)
# --------------------
@admin_required
def holiday_list(request, doctor_id):
    doctor = get_object_or_404(Doctor, pk=doctor_id)
    holidays = doctor.holidays.all()
    return render(request, "admin_panel/holiday_list.html", {
        "doctor": doctor,
        "holidays": holidays,
    })


@admin_required
def holiday_create(request, doctor_id):
    doctor = get_object_or_404(Doctor, pk=doctor_id)
    if request.method == "POST":
        form = DoctorHolidayForm(request.POST)
        if form.is_valid():
            h = form.save(commit=False)
            h.doctor = doctor
            h.save()
            messages.success(request, "İzin günü eklendi.")
            return redirect("admin_doctors:holiday_list", doctor_id=doctor.id)
    else:
        form = DoctorHolidayForm()
    return render(request, "admin_panel/holiday_form.html", {"form": form, "doctor": doctor})


@admin_required
def holiday_delete(request, pk):
    h = get_object_or_404(DoctorHoliday, pk=pk)
    doctor_id = h.doctor.id
    if request.method == "POST":
        h.delete()
        messages.success(request, "İzin silindi.")
        return redirect("admin_doctors:holiday_list", doctor_id=doctor_id)
    return render(request, "admin_panel/holiday_confirm_delete.html", {"holiday": h})


# --------------------
# Slot üretme (FR14 – availability yönetimi)
# --------------------
def _generate_slots_for_doctor(doctor, start_date, end_date, slot_minutes=30):
    """
    WorkingDay + DoctorHoliday'lere göre slot oluşturur.
    """
    working_days = WorkingDay.objects.filter(doctor=doctor, is_active=True)
    weekday_map = {wd.weekday: wd for wd in working_days}

    current = start_date
    while current <= end_date:
        weekday = current.weekday()

        # Tatil mi?
        if DoctorHoliday.objects.filter(doctor=doctor, date=current).exists():
            current += timedelta(days=1)
            continue

        wd = weekday_map.get(weekday)
        if wd is None:
            current += timedelta(days=1)
            continue

        # Slotları üret
        t = datetime.combine(date.min, wd.start_time)
        end_t = datetime.combine(date.min, wd.end_time)

        while t < end_t:
            Schedule.objects.get_or_create(
                doctor=doctor,
                date=current,
                time=t.time(),
                defaults={"is_booked": False},
            )
            t += timedelta(minutes=slot_minutes)

        current += timedelta(days=1)


@admin_required
def generate_slots_view(request, doctor_id):
    doctor = get_object_or_404(Doctor, pk=doctor_id)

    if request.method == "POST":
        form = SlotGenerationForm(request.POST)
        if form.is_valid():
            start_date = form.cleaned_data["start_date"]
            end_date = form.cleaned_data["end_date"]
            slot_minutes = form.cleaned_data["slot_minutes"]

            _generate_slots_for_doctor(doctor, start_date, end_date, slot_minutes)
            messages.success(request, "Slots başarıyla oluşturuldu.")
            return redirect("admin_doctors:doctor_list")
    else:
        form = SlotGenerationForm()

    return render(request, "admin_panel/generate_slots.html", {
        "form": form,
        "doctor": doctor,
    })
