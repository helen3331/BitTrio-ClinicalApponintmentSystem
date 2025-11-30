from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentCreateSerializer, DoctorAppointmentSerializer
from rest_framework.permissions import IsAuthenticated

class AppointmentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AppointmentCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        return Response(AppointmentSerializer(appointment).data)

class MyAppointmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        appointments = Appointment.objects.filter(patient=request.user)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    
class DoctorAppointmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Sadece doktor kendi randevusunu görebilir
        if user.role != "doctor":
            return Response({"detail": "Bu işlem için yetkiniz yok."}, status=403)

        # Doktora ait tüm randevuları getir
        appointments = (
            Appointment.objects
            .filter(doctor__user=user)
            .order_by("schedule__date", "schedule__time"))
        serializer = DoctorAppointmentSerializer(appointments, many=True)

        return Response(serializer.data)
    

class AdminDoctorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "admin":
            return Response({"detail": "Yetki yok"}, status=403)

        from doctors.models import Doctor
        from doctors.serializers import DoctorSerializer

        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)


class AdminDoctorCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "admin":
            return Response({"detail": "Yetki yok"}, status=403)

        from accounts.models import User
        from doctors.models import Doctor

        email = request.data.get("email")
        full_name = request.data.get("full_name")
        clinic_id = request.data.get("clinic_id")
        title = request.data.get("title")

        if User.objects.filter(email=email).exists():
            return Response({"detail": "Email zaten kayıtlı"}, status=400)

        user = User.objects.create(
            email=email,
            full_name=full_name,
            role="doctor",
            username=email
        )

        doctor = Doctor.objects.create(
            user=user,
            clinic_id=clinic_id,
            title=title
        )

        return Response({"detail": "Doktor oluşturuldu", "doctor_id": doctor.id})


class AdminDoctorUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, doctor_id):
        if request.user.role != "admin":
            return Response({"detail": "Yetki yok"}, status=403)

        from doctors.models import Doctor
        doctor = Doctor.objects.get(id=doctor_id)

        doctor.title = request.data.get("title", doctor.title)
        doctor.clinic_id = request.data.get("clinic_id", doctor.clinic_id)
        doctor.save()

        user = doctor.user
        user.full_name = request.data.get("full_name", user.full_name)
        user.email = request.data.get("email", user.email)
        user.save()

        return Response({"detail": "Doktor güncellendi"})


class AdminDoctorDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, doctor_id):
        if request.user.role != "admin":
            return Response({"detail": "Yetki yok"}, status=403)

        from doctors.models import Doctor
        Doctor.objects.filter(id=doctor_id).delete()

        return Response({"detail": "Doktor silindi"})


class AdminDoctorScheduleListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, doctor_id):
        if request.user.role != "admin":
            return Response({"detail": "Yetki yok"}, status=403)

        from doctors.models import Schedule
        from appointments.serializers import ScheduleSerializer

        schedules = Schedule.objects.filter(doctor_id=doctor_id)
        serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data)


class AdminDoctorScheduleCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, doctor_id):
        if request.user.role != "admin":
            return Response({"detail": "Yetki yok"}, status=403)

        from doctors.models import Schedule

        date = request.data.get("date")
        time = request.data.get("time")

        schedule = Schedule.objects.create(
            doctor_id=doctor_id,
            date=date,
            time=time,
            is_booked=False
        )

        return Response({"detail": "Çalışma saati eklendi", "id": schedule.id})


class AdminDoctorScheduleDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, schedule_id):
        if request.user.role != "admin":
            return Response({"detail": "Yetki yok"}, status=403)

        from doctors.models import Schedule
        Schedule.objects.filter(id=schedule_id).delete()

        return Response({"detail": "Çalışma saati silindi"})
