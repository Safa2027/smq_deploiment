from django.contrib import admin
from .models import *

admin.site.register(Utilisateur)
admin.site.register(Structure)
admin.site.register(Processus)
admin.site.register(Tache)
admin.site.register(InfoDocumentee)
admin.site.register(Contrainte)
admin.site.register(Anomalie)
admin.site.register(KPI)
admin.site.register(KPIProcessus)
admin.site.register(Moyens)
admin.site.register(Exigence)
admin.site.register(ExigenceItem)
admin.site.register(ExigenceValidation)
admin.site.register(NonConformite)
admin.site.register(Audit)
admin.site.register(PlanAction)