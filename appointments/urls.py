from django.urls import path
from .views import AppointmentCreateView, MyAppointmentsView, DoctorAppointmentsView

urlpatterns = [
    path('create/', AppointmentCreateView.as_view(), name='appointment-create'),
    path("my/", MyAppointmentsView.as_view()),
    path("doctor/", DoctorAppointmentsView.as_view()),
]