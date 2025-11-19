from rest_framework import serializers
from .models import Appointment
from doctors.serializers import DoctorSerializer, ScheduleSerializer
from accounts.serializers import UserSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    schedule = ScheduleSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ('id', 'patient', 'doctor', 'schedule','created_at')

class DoctorAppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    clinic_name = serializers.CharField(source="doctor.clinic.name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.user.full_name", read_only=True)

    class Meta:
        model = Appointment
        fields = (
            "appointment_id",
            "patient_name",
            "clinic_name",
            "doctor_name",
            "appointment_time",
            "status",
        )

class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ["doctor", "schedule"]

    def validate(self, data):
        if data["schedule"].is_booked:
            raise serializers.ValidationError("Bu slot dolu.")
        return data

    def create(self, validated_data):
        schedule = validated_data["schedule"]
        schedule.is_booked = True
        schedule.save()

        return Appointment.objects.create(
            patient=self.context["request"].user,
            doctor=validated_data["doctor"],
            schedule=schedule
        )