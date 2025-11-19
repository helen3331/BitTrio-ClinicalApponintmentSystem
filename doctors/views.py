from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Doctor, Schedule
from .serializers import DoctorSerializer, ScheduleSerializer

class DoctorCreateView(APIView):
    def post(self, request):
        user_id = request.data.get("user")
        clinic_id = request.data.get("clinic")
        title = request.data.get("title", "")

        if not user_id or not clinic_id:
            return Response({"error": "user and clinic required"}, status=400)

        doctor = Doctor.objects.create(
            user_id=user_id,
            clinic_id=clinic_id,
            title=title,
        )

        return Response({
            "id": doctor.id,
            "user": doctor.user.full_name,
            "clinic": doctor.clinic.name,
            "title": doctor.title
        })


class DoctorListByClinicView(APIView):
    def get(self, request, clinic_id):
        doctors = Doctor.objects.filter(clinic_id=clinic_id)
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)

class ScheduleCreateView(APIView):
    def post(self, request):
        doctor_id = request.data.get("doctor")
        date = request.data.get("date")
        time = request.data.get("time")

        if not doctor_id or not date or not time:
            return Response({"error": "doctor, date, time required"}, status=400)

        schedule = Schedule.objects.create(
            doctor_id=doctor_id,
            date=date,
            time=time,
            is_booked=False
        )

        return Response({
            "id": schedule.id,
            "doctor": schedule.doctor.user.full_name,
            "date": schedule.date,
            "time": schedule.time
        })

class DoctorAvailabilityView(APIView):
    def get(self, request, doctor_id):
        slots = Schedule.objects.filter(doctor_id=doctor_id, is_booked=False)
        serializer = ScheduleSerializer(slots, many=True)
        return Response(serializer.data)
