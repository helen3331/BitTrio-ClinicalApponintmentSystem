from rest_framework import serializers
from .models import User
from doctors.models import Doctor
from clinics.models import Clinic
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate

class PatientRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["email", "username", "full_name", "password"]

    def validate(self, data):
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError({"email": "Bu email zaten kayıtlı."})

        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError({"username": "Bu kullanıcı adı zaten var."})

        return data

    def create(self, validated_data):
        user = User(
            email=validated_data["email"],
            username=validated_data["username"],
            full_name=validated_data.get("full_name", ""),
            role="patient",
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class DoctorRegisterSerializer(serializers.Serializer):
    # password = serializers.CharField(write_only=True, validators=[validate_password])

    # class Meta:
    #     model = User
    #     fields = ["email", "username", "full_name", "password", "clinic_id"]

    email = serializers.EmailField()
    username = serializers.CharField()
    full_name = serializers.CharField()
    password = serializers.CharField(write_only=True, validators=[validate_password])
    title = serializers.CharField()
    clinic_id = serializers.IntegerField(write_only=True)

    def validate_email(self, value):
        if not value.endswith("@doc.com"):
            raise serializers.ValidationError("Doktor kaydı için email '@doc.com' ile bitmelidir.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Bu username zaten kayıtlı.")
        return value

    def validate_clinic_id(self, value):
        if not Clinic.objects.filter(id=value).exists():
            raise serializers.ValidationError("Geçerli bir klinik ID girilmelidir.")
        return value

    def create(self, validated_data):
        clinic_id = validated_data.pop("clinic_id")
        clinic = Clinic.objects.get(id=clinic_id)
        title = validated_data.pop("title")

        user = User(
            email=validated_data["email"],
            username=validated_data["username"],
            full_name=validated_data.get("full_name", ""),
            role="doctor",
        )
        user.set_password(validated_data["password"])
        user.save()

        # Doktor profilini oluştur
        Doctor.objects.create(
            user=user,
            clinic=clinic,
            title=title)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError("Email veya şifre yanlış.")

        attrs["user"] = user
        attrs["role"] = user.role   #  burada role ekledik
        attrs["full_name"] = user.full_name  #  burada full_name ekledik
        return attrs

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "full_name"]