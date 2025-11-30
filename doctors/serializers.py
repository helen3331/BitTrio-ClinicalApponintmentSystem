from rest_framework import serializers
from .models import Doctor, Schedule
from accounts.serializers import UserSerializer
from clinics.serializers import ClinicSerializer

class DoctorSerializer(serializers.ModelSerializer):
    # Read-only alanlar
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    clinic_name = serializers.CharField(source='clinic.name', read_only=True)

    # Admin için yazılabilir alanlar:
    # user_id (zorunlu değil, doktor oluştururken kullanılır)
    user_id = serializers.IntegerField(write_only=True, required=False)
    email = serializers.CharField(source='user.email', read_only=True)

    # clinic_id (var olan Clinic FK'sini set etmek için)
    clinic_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Doctor
        fields = (
            'id',
            'full_name',
            'clinic_name',
            'title',

            # Admin oluşturma/güncelleme için:
            'user_id',
            'clinic_id',
            'email',
        )

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ["id", "date", "time", "is_booked"]