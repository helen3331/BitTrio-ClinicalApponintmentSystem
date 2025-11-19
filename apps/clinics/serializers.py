from rest_framework import serializers
from .models import Clinic, Symptom

class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ('id', 'name')

# class SymptomSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Symptom
#         fields = ('id', 'description')
class ClinicDetailSerializer(serializers.ModelSerializer):
    symptoms = serializers.SerializerMethodField()

    class Meta:
        model = Clinic
        fields = ('id', 'name', 'symptoms')

    def get_symptoms(self, obj):
        return [s.description for s in obj.symptoms.all()]