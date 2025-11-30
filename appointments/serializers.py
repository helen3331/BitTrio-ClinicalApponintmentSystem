from rest_framework import serializers
from .models import Appointment
from doctors.models import Schedule

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.user.full_name", read_only=True)
    clinic_name = serializers.CharField(source="doctor.clinic.name", read_only=True)
    date = serializers.DateField(source="schedule.date", read_only=True)
    time = serializers.TimeField(source="schedule.time", read_only=True)

    class Meta:
        model = Appointment
        fields = (
            "id",
            "patient_name",
            "doctor_name",
            "clinic_name",
            "date",
            "time",
            "status",
            "created_at",
        )

class DoctorAppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.full_name", read_only=True)
    clinic_name = serializers.CharField(source="doctor.clinic.name", read_only=True)
    doctor_name = serializers.CharField(source="doctor.user.full_name", read_only=True)
    appointment_time = serializers.SerializerMethodField()
    
    def get_appointment_time(self, obj):
        return f"{obj.schedule.date} {obj.schedule.time}"
    
    class Meta:
        model = Appointment
        fields = (
            "id",
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
    
class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = "__all__"