from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def ping(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ping/', ping),        # ← accessible via /ping/
    path('api/', include('api.urls')),
]