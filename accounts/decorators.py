# accounts/decorators.py
from functools import wraps
from django.shortcuts import redirect
from django.urls import reverse

def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            # login sayfasına yönlendir
            return redirect(f"{reverse('login')}?next={request.path}")
        if getattr(user, "role", None) != "admin":
            return redirect("no_permission")  # basit bir “erişiminiz yok” sayfası
        return view_func(request, *args, **kwargs)
    return _wrapped_view
