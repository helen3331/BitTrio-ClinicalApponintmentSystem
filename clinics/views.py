from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Clinic, Symptom
from .serializers import ClinicSerializer, ClinicDetailSerializer

class ClinicCreateView(APIView):
    def post(self, request):
        name = request.data.get("name")
        if not name:
            return Response({"error": "Name required"}, status=400)

        clinic = Clinic.objects.create(name=name)
        return Response({"id": clinic.id, "name": clinic.name})

class ClinicListView(APIView):
    def get(self, request):
        clinics = Clinic.objects.all()
        serializer = ClinicSerializer(clinics, many=True)
        return Response(serializer.data)
    
class SymptomCreateView(APIView):
    def post(self, request):
        clinic = request.data.get("clinic")
        description = request.data.get("description")

        if not clinic or not description:
            return Response({"error": "clinic and description required"}, status=400)

        symptom = Symptom.objects.create(clinic_id=clinic, description=description)
        return Response({"id": symptom.id, "description": symptom.description})

# class SymptomListView(APIView):
#     def get(self, request, clinic_id):
#         symptoms = Symptom.objects.filter(clinic_id=clinic_id)
#         serializer = SymptomSerializer(symptoms, many=True)
#         return Response(serializer.data)

class ClinicSymptomsView(APIView):
    def get(self, request, clinic_id):
        clinic = Clinic.objects.get(pk=clinic_id)
        serializer = ClinicDetailSerializer(clinic)
        return Response(serializer.data)
    
class ClinicIDFromNameView(APIView):
    def post(self, request):
        name = request.data.get("name", "").strip()

        if not name:
            return Response({"error": "name field is required"}, status=400)

        try:
            clinic = Clinic.objects.get(name__iexact=name)
        except Clinic.DoesNotExist:
            return Response({"error": "Böyle bir klinik bulunamadı"}, status=404)

        return Response({
            "clinic_id": clinic.id,
            "clinic_name": clinic.name
        })