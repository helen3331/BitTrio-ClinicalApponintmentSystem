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
        appointments = Appointment.objects.filter(doctor__user=user).order_by("appointment_time")
        serializer = DoctorAppointmentSerializer(appointments, many=True)

        return Response(serializer.data)