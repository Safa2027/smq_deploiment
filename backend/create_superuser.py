import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

user, created = User.objects.get_or_create(
    email='a@esi.dz',
    defaults={'nom': 'Admin', 'prenom': 'Admin'}
)
user.is_staff = True
user.is_superuser = True
user.set_password('a')
user.save()
print("Superuser prêt ✅")