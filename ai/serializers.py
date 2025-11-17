from rest_framework import serializers

class SymptomInputSerializer(serializers.Serializer):
    symptoms = serializers.CharField()
