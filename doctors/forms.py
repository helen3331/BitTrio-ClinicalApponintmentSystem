# doctors/forms.py
from django import forms
from .models import Doctor, WorkingDay, DoctorHoliday
from django.contrib.auth import get_user_model

User = get_user_model()

class DoctorForm(forms.ModelForm):
    """Adminin doktor profili oluşturup düzenlemesi için."""
    class Meta:
        model = Doctor
        fields = ["user", "clinic", "title"]

class WorkingDayForm(forms.ModelForm):
    class Meta:
        model = WorkingDay
        fields = ["weekday", "start_time", "end_time", "is_active"]

class DoctorHolidayForm(forms.ModelForm):
    class Meta:
        model = DoctorHoliday
        fields = ["date", "reason"]

class SlotGenerationForm(forms.Form):
    start_date = forms.DateField(widget=forms.DateInput(attrs={"type": "date"}))
    end_date = forms.DateField(widget=forms.DateInput(attrs={"type": "date"}))
    slot_minutes = forms.IntegerField(initial=30, min_value=5, max_value=240)
