from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from openai import OpenAI

client = OpenAI(api_key=settings.OPENAI_API_KEY)

class AIAnalyzeSymptomsView(APIView):
    def post(self, request):
        symptoms = request.data.get("symptoms", "")

        if not symptoms:
            return Response({"error": "Symptoms field is required."}, status=400)

        prompt = f"""
        Aşağıdaki semptomları değerlendir ve en olası 1-3 polikliniği öner.
        Cevabı sadece JSON formatında döndür:

        Format:
        {{
            "clinics": ["KBB", "Dahiliye"],
            "reason": "Kullanıcının X ve Y semptomları bu kliniklere uygun."
        }}

        Semptomlar: {symptoms}
        """

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a medical triage assistant."},
                    {"role": "user", "content": prompt}
                ]
            )

            ai_output = response.choices[0].message.content

            return Response({"result": ai_output})

        except Exception as e:
            return Response({"error": str(e)}, status=500)