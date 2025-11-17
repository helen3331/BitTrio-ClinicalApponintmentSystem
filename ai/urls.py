from django.urls import path
from .views import AIAnalyzeSymptomsView

urlpatterns = [
    path('analyze/', AIAnalyzeSymptomsView.as_view(), name="ai-analyze"),
]