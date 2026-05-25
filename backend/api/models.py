from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


# ─────────────────────────────
# USER MANAGER
# ─────────────────────────────

class UtilisateurManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email obligatoire")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", Utilisateur.PILOTE)
        return self.create_user(email, password, **extra_fields)


# ─────────────────────────────
# USER
# ─────────────────────────────

class Utilisateur(AbstractBaseUser, PermissionsMixin):
    METIER = "metier"
    PILOTE = "pilote"
    AUDITEUR_INTERNE = "auditeur_interne"
    AUDITEUR_EXTERNE = "auditeur_externe"

    ROLE_CHOICES = [
        (METIER, "Metier"),
        (PILOTE, "Pilote"),
        (AUDITEUR_INTERNE, "Auditeur Interne"),
        (AUDITEUR_EXTERNE, "Auditeur Externe"),
    ]

    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default=METIER)

    telephone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = UtilisateurManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nom", "prenom"]

    def __str__(self):
        return self.email


# ─────────────────────────────
# STRUCTURE
# ─────────────────────────────

class Structure(models.Model):
    nom_structure = models.CharField(max_length=200)
    type_structure = models.CharField(max_length=100)

    def __str__(self):
        return self.nom_structure


# ─────────────────────────────
# PROCESSUS
# ─────────────────────────────

class Processus(models.Model):
    designation = models.CharField(max_length=255)
    objectif = models.TextField(blank=True)
    type_processus = models.CharField(max_length=50, default="Support")

    pilote = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True, blank=True)
    structure = models.ForeignKey(Structure, on_delete=models.SET_NULL, null=True, blank=True)

    etat_pr = models.CharField(max_length=20, default="brouillon")
    score_iso = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.designation


# ─────────────────────────────
# TACHE
# ─────────────────────────────

class Tache(models.Model):
    processus = models.ForeignKey(Processus, on_delete=models.CASCADE, related_name="taches")
    nom = models.CharField(max_length=255)
    numero = models.CharField(max_length=20)


# ─────────────────────────────
# DOCUMENT
# ─────────────────────────────

class InfoDocumentee(models.Model):
    processus = models.ForeignKey(Processus, on_delete=models.CASCADE, related_name="documents")
    nom_document = models.CharField(max_length=255)
    lien = models.URLField(blank=True)


# ─────────────────────────────
# CONTRAINTE
# ─────────────────────────────

class Contrainte(models.Model):
    processus = models.ForeignKey(Processus, on_delete=models.CASCADE, related_name="contraintes")
    description = models.TextField()


# ─────────────────────────────
# ANOMALIE
# ─────────────────────────────

class Anomalie(models.Model):
    processus = models.ForeignKey(Processus, on_delete=models.CASCADE, related_name="anomalies")
    description = models.TextField()


# ─────────────────────────────
# KPI
# ─────────────────────────────

class KPI(models.Model):
    indicateur = models.CharField(max_length=255)
    cible = models.CharField(max_length=100)


class KPIProcessus(models.Model):
    processus = models.ForeignKey(Processus, on_delete=models.CASCADE, related_name="kpis")
    kpi = models.ForeignKey(KPI, on_delete=models.CASCADE)
    frequence = models.CharField(max_length=50)


# ─────────────────────────────
# MOYENS
# ─────────────────────────────

class Moyens(models.Model):
    processus = models.OneToOneField(Processus, on_delete=models.CASCADE, related_name="moyens")
    description = models.TextField()


# ─────────────────────────────
# EXIGENCE ISO
# ─────────────────────────────

class Exigence(models.Model):
    code = models.CharField(max_length=20)   # ISO 4.4
    titre = models.CharField(max_length=255)

class ExigenceItem(models.Model):
    exigence = models.ForeignKey(Exigence, on_delete=models.CASCADE, related_name="items")
    text = models.TextField()

class ExigenceValidation(models.Model):
    processus = models.ForeignKey(Processus, on_delete=models.CASCADE)
    item = models.ForeignKey(ExigenceItem, on_delete=models.CASCADE)
    is_validated = models.BooleanField(default=False)



# ─────────────────────────────
# NON CONFORMITE
# ─────────────────────────────

class NonConformite(models.Model):
    processus = models.ForeignKey(Processus, on_delete=models.CASCADE, related_name="non_conformites")
    description = models.TextField()
    gravite = models.CharField(max_length=20)
    etat_nc = models.CharField(max_length=20, default="ouverte")
    created_at = models.DateTimeField(auto_now_add=True)


# ─────────────────────────────
# AUDIT
# ─────────────────────────────

class Audit(models.Model):
    processus = models.ForeignKey(Processus, on_delete=models.CASCADE, related_name="audits", null=True, blank=True)
    auditeur = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True)
    titre = models.CharField(max_length=255, blank=True)
    clause = models.CharField(max_length=100, blank=True)
    date_audit = models.DateField(null=True, blank=True)
    date_debut = models.DateField(null=True, blank=True)
    date_fin = models.DateField(null=True, blank=True)
    etat_audit = models.CharField(max_length=20, default="planifie")
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


# ─────────────────────────────
# PLAN ACTION
# ─────────────────────────────

class PlanAction(models.Model):
    processus = models.ForeignKey(Processus, on_delete=models.CASCADE, related_name="plan_actions")
    responsable = models.ForeignKey(Utilisateur, on_delete=models.SET_NULL, null=True)
    action = models.TextField()
    clause = models.CharField(max_length=100, blank=True)
    statut = models.CharField(max_length=20, default="en_cours")
    priorite = models.CharField(max_length=20, blank=True)
    delai = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)




from django.db import models
from django.conf import settings

class PasswordResetToken(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)

    def __str__(self):
        return self.token
