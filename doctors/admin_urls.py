# doctors/admin_urls.py
from django.urls import path
from . import admin_views

urlpatterns = [
    path("", admin_views.admin_dashboard, name="dashboard"),

    # Doctor CRUD
    path("doctors/", admin_views.doctor_list, name="doctor_list"),
    path("doctors/add/", admin_views.doctor_create, name="doctor_add"),
    path("doctors/<int:pk>/edit/", admin_views.doctor_update, name="doctor_edit"),
    path("doctors/<int:pk>/delete/", admin_views.doctor_delete, name="doctor_delete"),

    # Working days
    path("doctors/<int:doctor_id>/working-days/", admin_views.workingday_list, name="workingday_list"),
    path("doctors/<int:doctor_id>/working-days/add/", admin_views.workingday_create, name="workingday_add"),
    path("working-days/<int:pk>/delete/", admin_views.workingday_delete, name="workingday_delete"),

    # Holidays
    path("doctors/<int:doctor_id>/holidays/", admin_views.holiday_list, name="holiday_list"),
    path("doctors/<int:doctor_id>/holidays/add/", admin_views.holiday_create, name="holiday_add"),
    path("holidays/<int:pk>/delete/", admin_views.holiday_delete, name="holiday_delete"),

    # Slot generation
    path("doctors/<int:doctor_id>/generate-slots/", admin_views.generate_slots_view, name="generate_slots"),
]