from django.urls import path
from .views import ClinicCreateView, ClinicListView, SymptomCreateView, SymptomListView, ClinicIDFromNameView

urlpatterns = [
    path('list/', ClinicListView.as_view(), name='clinic-list'),
    path('<int:clinic_id>/symptoms/', SymptomListView.as_view(), name='symptom-list'),
    path('from-name/', ClinicIDFromNameView.as_view(), name='clinic-from-name'),
    path('create/', ClinicCreateView.as_view(), name='clinic-create'),
    path('symptom/create/', SymptomCreateView.as_view(), name='symptom-create'),

]