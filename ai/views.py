from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from openai import OpenAI
import json

client = OpenAI(api_key=settings.OPENAI_API_KEY)


class AIAnalyzeSymptomsView(APIView):

    def post(self, request):
<<<<<<< Updated upstream
        ai_output = {
            "clinic": ["Dahiliye"],
            "reason": "Kullanıcının X ve Y semptomları bu kliniklere uygun."
            }
        return Response({"result": ai_output})
    #     symptoms = request.data.get("symptoms", "")

    #     if not symptoms:
    #         return Response({"error": "Symptoms field is required."}, status=400)
=======
        symptoms = request.data.get("symptoms", "")

        if not symptoms:
            return Response({"error": "Symptoms field is required."}, status=400)

        example_json = """
        {{
            "clinics": [
                {{
                    "name": "KBB",
                    "reason": "X semptomu KBB değerlendirmesi gerektirir."
                }},
                {{
                    "name": "Dahiliye",
                    "reason": "Y semptomu dahiliye ile ilgilidir."
                }}
            ]
        }}
        """

        prompt = f"""
        Aşağıdaki kullanıcı semptomlarını değerlendir ve en uygun 1–3 polikliniği öner.

        **Sadece şu polikliniklerden seçim yapabilirsin:**
        - Kardiyoloji
        - KBB
        - Dahiliye
        - Nöroloji
        - Ortopedi

        **Kurallar:**
        1. Cevap yalnızca GEÇERLİ JSON olacak.
        2. JSON dışında hiçbir açıklama veya metin olmayacak.
        3. Her poliklinik ayrı bir obje şeklinde yazılacak.
        4. Her poliklinik için kısa ve klinik temelli bir reason yazılacak.
        5. En az 1, en fazla 3 klinik döndürülecek.

        **Beklenen JSON formatı:**
        {example_json}

        ### Kullanıcı semptomları:
        {symptoms}

        Sadece JSON formatında yanıt ver.
        """
>>>>>>> Stashed changes

    #     prompt = f"""
    #     Aşağıdaki semptomları değerlendir ve en olası 1-3 polikliniği öner.
    #     Cevabı sadece JSON formatında döndür:

<<<<<<< Updated upstream
    #     Format:
    #     {{
    #         "clinics": ["KBB", "Dahiliye"],
    #         "reason": "Kullanıcının X ve Y semptomları bu kliniklere uygun."
    #     }}
=======
            ai_output_str = response.choices[0].message.content

            print("\n--- AI RAW OUTPUT ---")
            print(ai_output_str)
            print("---------------------\n")

            try:
                ai_output = json.loads(ai_output_str)
            except json.JSONDecodeError:
                ai_output = {
                    "error": "JSON parse edilemedi",
                    "raw_output": ai_output_str
                }
>>>>>>> Stashed changes

    #     Semptomlar: {symptoms}
    #     """

    #     try:
    #         response = client.chat.completions.create(
    #             model="gpt-4o-mini",
    #             messages=[
    #                 {"role": "system", "content": "You are a medical triage assistant."},
    #                 {"role": "user", "content": prompt}
    #             ]
    #         )

    #         ai_output = response.choices[0].message.content

    #         return Response({"result": ai_output})

    #     except Exception as e:
    #         return Response({"error": str(e)}, status=500)

<<<<<<< Updated upstream
=======
        except Exception as e:
            print("AI ERROR:", e)
            return Response({"error": str(e)}, status=500)
>>>>>>> Stashed changes
