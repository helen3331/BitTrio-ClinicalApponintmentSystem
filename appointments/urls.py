from django.urls import path
from .views import AppointmentCreateView, MyAppointmentsView, DoctorAppointmentsView
from .views import (
    AdminDoctorListView,
    AdminDoctorCreateView,
    AdminDoctorUpdateView,
    AdminDoctorDeleteView,
    AdminDoctorScheduleListView,
    AdminDoctorScheduleCreateView,
    AdminDoctorScheduleDeleteView,
)
urlpatterns = [
    path('create/', AppointmentCreateView.as_view(), name='appointment-create'),
    path("my/", MyAppointmentsView.as_view()),
    path("doctor/", DoctorAppointmentsView.as_view()),

    path("admin/doctors/", AdminDoctorListView.as_view()),
    path("admin/doctors/create/", AdminDoctorCreateView.as_view()),
    path("admin/doctors/<int:doctor_id>/update/", AdminDoctorUpdateView.as_view()),
    path("admin/doctors/<int:doctor_id>/delete/", AdminDoctorDeleteView.as_view()),

    # Doktor Programı Yönetimi
    path("admin/schedules/<int:doctor_id>/", AdminDoctorScheduleListView.as_view()),
    path("admin/schedules/<int:doctor_id>/create/", AdminDoctorScheduleCreateView.as_view()),
    path("admin/schedules/<int:schedule_id>/delete/", AdminDoctorScheduleDeleteView.as_view()),
]