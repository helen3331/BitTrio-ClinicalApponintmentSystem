from django.urls import path
from .views import PatientRegisterView, LoginView, DoctorRegisterView
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/patient/', PatientRegisterView.as_view(), name='register'),
    path("register/doctor/", DoctorRegisterView.as_view()),
    path('login/', LoginView.as_view(), name='login'),
    # path('login/', TokenObtainPairView.as_view(), name='login'),
    # path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
