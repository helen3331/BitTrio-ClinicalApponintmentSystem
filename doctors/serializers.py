from rest_framework import serializers
from .models import Doctor, Schedule
from accounts.serializers import UserSerializer
from clinics.serializers import ClinicSerializer

class DoctorSerializer(serializers.ModelSerializer):
    # doctor_name = serializers.CharField(source='user.username', read_only=True)
    # clinic_name = serializers.CharField(source='clinic.name', read_only=True)

    # user = UserSerializer(read_only=True)
    # clinic = ClinicSerializer(read_only=True)

    full_name = serializers.CharField(source='user.full_name', read_only=True)
    # username = serializers.CharField(source='user.username', read_only=True)
    clinic_name = serializers.CharField(source='clinic.name', read_only=True)
    
    class Meta:
        model = Doctor
        fields = ('id', "full_name", 'clinic_name', 'title')

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ["id", "date", "time", "is_booked"]