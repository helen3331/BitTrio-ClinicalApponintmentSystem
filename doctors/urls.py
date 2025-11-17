from django.urls import path
from .views import DoctorListByClinicView, DoctorAvailabilityView, ScheduleCreateView, DoctorCreateView

urlpatterns = [
    path('<int:clinic_id>/', DoctorListByClinicView.as_view(), name='doctor-list-by-clinic'),
    path("<int:doctor_id>/availability/", DoctorAvailabilityView.as_view()),
    path('create/', DoctorCreateView.as_view(), name='doctor-create'),
    path("schedule/create/", ScheduleCreateView.as_view()),
]