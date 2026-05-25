from django.db import models
from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.conf import settings
from django.utils.crypto import get_random_string
from django.core.mail import send_mail

from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    ExigenceValidation, Utilisateur, Structure, Processus, Tache, InfoDocumentee,
    Contrainte, Anomalie, KPI, KPIProcessus, Moyens,
    Exigence, ExigenceItem , ExigenceValidation  , NonConformite, Audit, PlanAction,
    KPIProcessus, NonConformite, Audit, PlanAction
)
from .serializers import (
    LoginSerializer, RegisterSerializer,
    UtilisateurSerializer,
    StructureSerializer,
    ProcessusListSerializer, ProcessusDetailSerializer, ProcessusWriteSerializer,
    TacheSerializer, InfoDocumenteeSerializer, ContrainteSerializer,
    AnomalieSerializer, KPISerializer, KPIProcessusSerializer, MoyensSerializer,
    ExigenceSerializer, ExigenceItemSerializer, ExigenceValidationSerializer,
    NonConformiteSerializer, AuditSerializer, PlanActionSerializer,
    DashboardStatsSerializer,
)
from .permissions import (
    IsPilote, IsMetier, IsAuditeurInterne, IsAuditeurExterne,
    IsPiloteOrMetier, IsPiloteOrAuditeur, IsAnyRole, IsOwnerOrPilote,
)


# ══════════════════════════════════════════════
# AUTH
# ══════════════════════════════════════════════

class LoginView(APIView):
    """POST /api/auth/login/  →  { access, refresh, user }"""
    permission_classes = [AllowAny]

    def post(self, request):
        s = LoginSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        user    = s.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user':    UtilisateurSerializer(user).data,
        })


class LogoutView(APIView):
    """POST /api/auth/logout/  — blackliste le refresh token."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            RefreshToken(request.data['refresh']).blacklist()
            return Response({'detail': 'Déconnexion réussie.'})
        except Exception:
            return Response({'detail': 'Token invalide.'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/  — réservé au Pilote (DQ)."""
    serializer_class   = RegisterSerializer
    permission_classes = [IsPilote]


class MeView(APIView):
    """GET / PATCH /api/auth/me/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UtilisateurSerializer(request.user).data)

    def patch(self, request):
        s = UtilisateurSerializer(request.user, data=request.data, partial=True)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)


# ══════════════════════════════════════════════
# PASSWORD RESET (MOCK)
# ══════════════════════════════════════════════    

from .models import PasswordResetToken  # we will define this
from django.conf import settings
from django.utils.crypto import get_random_string
from django.core.mail import send_mail

from django.conf import settings
from django.core.mail import send_mail
from django.utils.crypto import get_random_string

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from .models import Utilisateur


class ResetPasswordRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"detail": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = Utilisateur.objects.filter(email=email).first()

        if not user:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # generate random password
        new_password = get_random_string(
            length=10,
            allowed_chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        )

        # update password
        user.set_password(new_password)
        user.save()

        # send email
        send_mail(
            subject="Your New Password",
            message=f"""
Hello {user.prenom},

Your password has been reset successfully.

Your new password is:

{new_password}

Please login and change it after connecting.
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {"detail": "New password sent by email"},
            status=status.HTTP_200_OK
        )
# ══════════════════════════════════════════════
# UTILISATEURS  (Pilote only)
# ══════════════════════════════════════════════

class UtilisateurListView(generics.ListAPIView):
    """GET /api/utilisateurs/"""
    queryset           = Utilisateur.objects.all()
    serializer_class   = UtilisateurSerializer
    permission_classes = [IsPilote]
    filter_backends    = [filters.SearchFilter, DjangoFilterBackend]
    search_fields      = ['nom', 'prenom', 'email']
    filterset_fields   = ['role', 'is_active']


class UtilisateurDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET / PUT / PATCH / DELETE /api/utilisateurs/<id>/"""
    queryset           = Utilisateur.objects.all()
    serializer_class   = UtilisateurSerializer
    permission_classes = [IsPilote]


# ══════════════════════════════════════════════
# STRUCTURE
# ══════════════════════════════════════════════

class StructureListCreateView(generics.ListCreateAPIView):
    queryset           = Structure.objects.all()
    serializer_class   = StructureSerializer
    permission_classes = [IsPiloteOrMetier]


class StructureDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Structure.objects.all()
    serializer_class   = StructureSerializer
    permission_classes = [IsPilote]


# ══════════════════════════════════════════════
# PROCESSUS
# ══════════════════════════════════════════════



class AddFicheProcessusView(APIView):

    def post(self, request):

        data = request.data

        try:
            # =========================
            # GET EXISTING PROCESSUS
            # =========================

            processus = Processus.objects.get(id=data.get("processus_id"))

            # =========================
            # CONTRAINTES
            # =========================

            for c in data.get("contraintes", []):
                Contrainte.objects.create(
                    processus=processus,
                    description=c.get("description")
                )

            # =========================
            # ANOMALIES
            # =========================

            for a in data.get("anomalies", []):
                Anomalie.objects.create(
                    processus=processus,
                    description=a.get("description")
                )

            # =========================
            # KPIs
            # =========================

            for k in data.get("kpis", []):

                kpi = KPI.objects.create(
                    indicateur=k.get("indicateur"),
                    cible=k.get("cible")
                )

                KPIProcessus.objects.create(
                    processus=processus,
                    kpi=kpi,
                    frequence=k.get("frequence")
                )

            # =========================
            # MOYENS (update or create)
            # =========================

            if data.get("moyens"):

                Moyens.objects.update_or_create(
                    processus=processus,
                    defaults={
                        "description": data.get("moyens")
                    }
                )

            # =========================
            # DOCUMENTS
            # =========================

            for d in data.get("documents", []):

                InfoDocumentee.objects.create(
                    processus=processus,
                    nom_document=d.get("nom_document"),
                    lien=d.get("lien", "")
                )

            processus.etat_pr = "fiche_deposee"
            processus.save(update_fields=["etat_pr", "updated_at"])

            return Response({
                "message": "Fiche de processus ajoutée avec succès",
                "processus_id": processus.id,
                "etat_pr": processus.etat_pr,
                "has_fiche": True,
            }, status=status.HTTP_200_OK)

        except Processus.DoesNotExist:
            return Response({
                "error": "Processus introuvable"
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
# ─────────────────────────────
# LISTE PROCESSUS
# ─────────────────────────────
from rest_framework.views import APIView
from rest_framework.response import Response

class ProcessusListView(APIView):

    def post(self, request):

        email = request.data.get("email")
        role = request.data.get("role")

        if not email or not role:
            return Response({"error": "email and role required"}, status=400)

        if role == "pilote":
            queryset = Processus.objects.select_related("pilote", "structure").all()
        else:
            queryset = Processus.objects.select_related("pilote", "structure").filter(pilote__email=email)

        serializer = ProcessusListSerializer(queryset, many=True)
        return Response(serializer.data)


class ProcessusCreateView(APIView):

    def post(self, request):
        serializer = ProcessusWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        processus = serializer.save()
        return Response(ProcessusDetailSerializer(processus).data, status=status.HTTP_201_CREATED)

# ─────────────────────────────
# DETAIL PROCESSUS
# ─────────────────────────────

class ProcessusDetailView(APIView):

    def post(self, request, pk):

        try:
            processus = Processus.objects.get(pk=pk)

        except Processus.DoesNotExist:
            return Response(
                {"error": "Processus introuvable"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProcessusDetailSerializer(processus)

        return Response(serializer.data)

    def patch(self, request, pk):

        try:
            processus = Processus.objects.get(pk=pk)

        except Processus.DoesNotExist:
            return Response(
                {"error": "Processus introuvable"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProcessusWriteSerializer(processus, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        processus = serializer.save()

        return Response(ProcessusDetailSerializer(processus).data)


# ─────────────────────────────
# VALIDATION PROCESSUS
# ─────────────────────────────

class ProcessusValiderView(APIView):

    def post(self, request, pk):

        try:
            processus = Processus.objects.get(pk=pk)

        except Processus.DoesNotExist:
            return Response(
                {"error": "Processus introuvable"},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            score = int(request.data.get("score", 0))
        except (TypeError, ValueError):
            score = 0

        score = max(0, min(score, 100))
        processus.score_iso = score

        if score >= 70:
            processus.etat_pr = "conforme"
        else:
            processus.etat_pr = "non_conforme"

        processus.save(update_fields=["score_iso", "etat_pr", "updated_at"])

        return Response({
            "message": "Validation effectuée",
            "etat_pr": processus.etat_pr,
            "score": processus.score_iso,
            "has_fiche": True,
        })
# ══════════════════════════════════════════════
# TACHE
# ══════════════════════════════════════════════

class TacheListCreateView(generics.ListCreateAPIView):
    """GET / POST /api/processus/<pr_pk>/taches/"""
    serializer_class   = TacheSerializer
    permission_classes = [IsPiloteOrMetier]

    def get_queryset(self):
        return Tache.objects.filter(processus_id=self.kwargs['pr_pk'])

    def perform_create(self, serializer):
        pr = get_object_or_404(Processus, pk=self.kwargs['pr_pk'])
        serializer.save(processus=pr)


class TacheDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Tache.objects.all()
    serializer_class   = TacheSerializer
    permission_classes = [IsPiloteOrMetier]


# ══════════════════════════════════════════════
# INFO DOCUMENTÉE
# ══════════════════════════════════════════════

class InfoDocumenteeListCreateView(generics.ListCreateAPIView):
    serializer_class   = InfoDocumenteeSerializer
    permission_classes = [IsPiloteOrMetier]

    def get_queryset(self):
        return InfoDocumentee.objects.filter(processus_id=self.kwargs['pr_pk'])

    def perform_create(self, serializer):
        pr = get_object_or_404(Processus, pk=self.kwargs['pr_pk'])
        serializer.save(processus=pr)


class InfoDocumenteeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = InfoDocumentee.objects.all()
    serializer_class   = InfoDocumenteeSerializer
    permission_classes = [IsPiloteOrMetier]


# ══════════════════════════════════════════════
# CONTRAINTE
# ══════════════════════════════════════════════

class ContrainteListCreateView(generics.ListCreateAPIView):
    serializer_class   = ContrainteSerializer
    permission_classes = [IsPiloteOrMetier]

    def get_queryset(self):
        return Contrainte.objects.filter(processus_id=self.kwargs['pr_pk'])

    def perform_create(self, serializer):
        pr = get_object_or_404(Processus, pk=self.kwargs['pr_pk'])
        serializer.save(processus=pr)


class ContrainteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Contrainte.objects.all()
    serializer_class   = ContrainteSerializer
    permission_classes = [IsPiloteOrMetier]


# ══════════════════════════════════════════════
# ANOMALIE
# ══════════════════════════════════════════════

class AnomalieListCreateView(generics.ListCreateAPIView):
    serializer_class   = AnomalieSerializer
    permission_classes = [IsPiloteOrMetier]

    def get_queryset(self):
        return Anomalie.objects.filter(processus_id=self.kwargs['pr_pk'])

    def perform_create(self, serializer):
        pr = get_object_or_404(Processus, pk=self.kwargs['pr_pk'])
        serializer.save(processus=pr)


class AnomalieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Anomalie.objects.all()
    serializer_class   = AnomalieSerializer
    permission_classes = [IsPiloteOrMetier]


# ══════════════════════════════════════════════
# KPI
# ══════════════════════════════════════════════

class KPIListCreateView(generics.ListCreateAPIView):
    """Référentiel global de KPI — Pilote only."""
    queryset           = KPI.objects.all()
    serializer_class   = KPISerializer
    permission_classes = [IsPilote]


class KPIDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = KPI.objects.all()
    serializer_class   = KPISerializer
    permission_classes = [IsPilote]


class KPIProcessusListCreateView(generics.ListCreateAPIView):
    serializer_class   = KPIProcessusSerializer
    permission_classes = [IsPiloteOrMetier]

    def get_queryset(self):
        return KPIProcessus.objects.filter(processus_id=self.kwargs['pr_pk']).select_related('kpi')

    def perform_create(self, serializer):
        pr = get_object_or_404(Processus, pk=self.kwargs['pr_pk'])
        serializer.save(processus=pr)


class KPIProcessusDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = KPIProcessus.objects.all()
    serializer_class   = KPIProcessusSerializer
    permission_classes = [IsPiloteOrMetier]


# ══════════════════════════════════════════════
# MOYENS
# ══════════════════════════════════════════════

class MoyensView(generics.RetrieveUpdateAPIView):
    """GET / PUT / PATCH /api/processus/<pr_pk>/moyens/"""
    serializer_class   = MoyensSerializer
    permission_classes = [IsPiloteOrMetier]

    def get_object(self):
        pr     = get_object_or_404(Processus, pk=self.kwargs['pr_pk'])
        obj, _ = Moyens.objects.get_or_create(processus=pr)
        return obj


# ══════════════════════════════════════════════
# EXIGENCES ISO 9001
# ══════════════════════════════════════════════

class ExigenceListCreateView(generics.ListCreateAPIView):
    queryset         = Exigence.objects.all()
    serializer_class = ExigenceSerializer
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['chapitre', 'description']

    def get_permissions(self):
        return [IsPilote()] if self.request.method == 'POST' else [IsAnyRole()]


class ExigenceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Exigence.objects.all()
    serializer_class   = ExigenceSerializer
    permission_classes = [IsPilote]


class ExigenceProcessusListCreateView(generics.ListCreateAPIView):
    serializer_class   = ExigenceValidationSerializer
    permission_classes = [IsPiloteOrMetier]

    def get_queryset(self):
        return ExigenceValidation.objects.filter(processus_id=self.kwargs['pr_pk'])

    def perform_create(self, serializer):
        pr = get_object_or_404(Processus, pk=self.kwargs['pr_pk'])
        serializer.save(processus=pr)


# ══════════════════════════════════════════════
# NON-CONFORMITE
# ══════════════════════════════════════════════

class NonConformiteListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/non-conformites/   → Pilote + Auditeurs (Métier voit les siennes)
    POST /api/non-conformites/   → Auditeur Interne / Pilote
    """
    serializer_class = NonConformiteSerializer
    filter_backends  = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['gravite', 'etat_nc', 'processus']
    ordering_fields  = ['created_at', 'gravite']

    def get_permissions(self):
        return [IsPiloteOrAuditeur()]

    def get_queryset(self):
        user = self.request.user
        qs   = NonConformite.objects.select_related('processus')
        if getattr(user, "role", Utilisateur.PILOTE) == Utilisateur.METIER:
            qs = qs.filter(processus__pilote=user)
        return qs


class NonConformiteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = NonConformite.objects.all()
    serializer_class   = NonConformiteSerializer
    permission_classes = [IsPiloteOrAuditeur]


class NCByProcessusView(generics.ListCreateAPIView):
    """GET / POST /api/processus/<pr_pk>/non-conformites/"""
    serializer_class   = NonConformiteSerializer
    permission_classes = [IsAnyRole]

    def get_queryset(self):
        return NonConformite.objects.filter(processus_id=self.kwargs['pr_pk'])

    def perform_create(self, serializer):
        pr = get_object_or_404(Processus, pk=self.kwargs['pr_pk'])
        serializer.save(processus=pr)


# ══════════════════════════════════════════════
# AUDIT
# ══════════════════════════════════════════════

class AuditListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/audits/   → Pilote + Auditeurs
    POST /api/audits/   → Pilote uniquement
    """
    serializer_class = AuditSerializer
    filter_backends  = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['etat_audit', 'processus', 'auditeur']
    ordering_fields  = ['date_audit', 'created_at']

    def get_permissions(self):
        return [IsPilote()] if self.request.method == 'POST' else [IsPiloteOrAuditeur()]

    def get_queryset(self):
        user = self.request.user
        qs   = Audit.objects.select_related('processus', 'auditeur')
        # Un auditeur ne voit que ses propres audits
        if getattr(user, "role", Utilisateur.PILOTE) in (Utilisateur.AUDITEUR_INTERNE, Utilisateur.AUDITEUR_EXTERNE):
            qs = qs.filter(auditeur=user)
        return qs


class AuditDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Audit.objects.all()
    serializer_class   = AuditSerializer
    permission_classes = [IsPiloteOrAuditeur]


class AuditByProcessusView(generics.ListCreateAPIView):
    """GET / POST /api/processus/<pr_pk>/audits/"""
    serializer_class   = AuditSerializer
    permission_classes = [IsAnyRole]

    def get_queryset(self):
        return Audit.objects.filter(processus_id=self.kwargs['pr_pk'])

    def perform_create(self, serializer):
        pr = get_object_or_404(Processus, pk=self.kwargs['pr_pk'])
        serializer.save(processus=pr)


# ══════════════════════════════════════════════
# PLAN D'ACTION
# ══════════════════════════════════════════════

class PlanActionListCreateView(generics.ListCreateAPIView):
    serializer_class = PlanActionSerializer
    filter_backends  = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['statut', 'priorite', 'processus', 'responsable']
    ordering_fields  = ['delai', 'priorite', 'created_at']

    def get_permissions(self):
        return [IsPiloteOrMetier()] if self.request.method == 'POST' else [IsAnyRole()]

    def get_queryset(self):
        user = self.request.user
        
        qs   = PlanAction.objects.select_related('processus', 'responsable')
        if getattr(user, "role", Utilisateur.PILOTE) == Utilisateur.METIER:
            qs = qs.filter(processus__pilote=user)
        return qs


class PlanActionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = PlanAction.objects.all()
    serializer_class   = PlanActionSerializer
    permission_classes = [IsPiloteOrMetier]


class PlanActionByProcessusView(generics.ListCreateAPIView):
    """GET / POST /api/processus/<pr_pk>/plan-actions/"""
    serializer_class   = PlanActionSerializer
    permission_classes = [IsPiloteOrMetier]

    def get_queryset(self):
        return PlanAction.objects.filter(processus_id=self.kwargs['pr_pk'])

    def perform_create(self, serializer):
        pr = get_object_or_404(Processus, pk=self.kwargs['pr_pk'])
        serializer.save(processus=pr)


# ══════════════════════════════════════════════
# DASHBOARD
# ══════════════════════════════════════════════

class DashboardView(APIView):
    """GET /api/dashboard/  — stats globales adaptées au rôle."""
    permission_classes = [IsAnyRole]

    def get(self, request):
        user = request.user

        if getattr(user, "role", Utilisateur.PILOTE) == Utilisateur.METIER:
            pr_qs = Processus.objects.filter(pilote=user)
        else:
            pr_qs = Processus.objects.all()

        nc_qs     = NonConformite.objects.filter(processus__in=pr_qs)
        action_qs = PlanAction.objects.filter(processus__in=pr_qs)
        audit_qs  = Audit.objects.filter(processus__in=pr_qs)

        total_pr    = pr_qs.count()
        pr_valides  = pr_qs.filter(etat_pr__in=['valide', 'conforme']).count()
        taux        = round(sum(p.score_iso or 0 for p in pr_qs) / total_pr, 1) if total_pr else 0.0

        data = {
            'total_processus':      total_pr,
            'processus_valides':    pr_valides,
            'total_nc':             nc_qs.count(),
            'nc_ouvertes':          nc_qs.filter(etat_nc='ouverte').count(),
            'nc_critiques':         nc_qs.filter(gravite='critique').count(),
            'total_actions':        action_qs.count(),
            'actions_en_cours':     action_qs.filter(statut='en_cours').count(),
            'total_audits':         audit_qs.count(),
            'audits_planifies':     audit_qs.filter(etat_audit='planifie').count(),
            'taux_conformite_pct':  taux,
        }
        return Response(DashboardStatsSerializer(data).data)


# ══════════════════════════════════════════════
# CHECKLIST ISO 9001
# ══════════════════════════════════════════════

class ChecklistView(APIView):
    """GET /api/checklist/  — conformité par chapitre ISO."""
    permission_classes = [IsAnyRole]

    def get(self, request):
        exigences = Exigence.objects.annotate(
            nb_nc_ouvertes=Count(
                'nonconformite',
                filter=Q(nonconformite__etat_nc__in=['ouverte', 'en_cours'])
            ),
            nb_nc_total=Count('nonconformite'),
        ).order_by('chapitre')

        result = [
            {
                'id':             e.pk,
                'chapitre':       e.chapitre,
                'description':    e.description,
                'conforme':       e.nb_nc_ouvertes == 0,
                'nb_nc_ouvertes': e.nb_nc_ouvertes,
                'nb_nc_total':    e.nb_nc_total,
            }
            for e in exigences
        ]

        total     = len(result)
        conformes = sum(1 for r in result if r['conforme'])

        return Response({
            'taux_conformite_global': round(conformes / total * 100, 1) if total else 0.0,
            'nb_clauses_conformes':   conformes,
            'nb_clauses_total':       total,
            'checklist':              result,
        })
    





class ProcessusEvaluationView(APIView):
    permission_classes = [IsAnyRole]

    def get(self, request, pk):
        p = get_object_or_404(Processus, pk=pk)

        score = p.score_iso or 0

        clauses = [
            max(0, score-10),
            max(0, score-5),
            max(0, score-25),
            max(0, score-8),
            score,
            max(0, score-12),
            max(0, score-15),
        ]

        return Response({
            "process": p.designation,
            "score": score,
            "clauses": clauses,
            "status": "conforme" if score >= 75 else "partiel" if score >= 40 else "non conforme",
            "message": "Analyse ISO générée automatiquement",
            "recommendations": [
                "Documenter les risques",
                "Améliorer indicateurs KPI",
                "Formaliser procédures"
            ]
        })
    


class ChecklistProcessView(APIView):
    permission_classes = [IsAnyRole]

    def get(self, request, pk):
        process = get_object_or_404(Processus, pk=pk)

        exigences = Exigence.objects.all()

        result = []
        for e in exigences:
            nc_count = e.nonconformite_set.filter(processus=process).count()

            result.append({
                "chapitre": e.chapitre,
                "description": e.description,
                "conforme": nc_count == 0,
                "nb_nc": nc_count
            })

        return Response({
            "process": process.designation,
            "checklist": result
        })
    

from django.db.models import Avg


class KPIEngine:

    @staticmethod
    def compute_process_score(process):
        """
        ISO-style weighted KPI score
        """

        # ─────────────────────────────
        # 1. KPI SCORE (40%)
        # ─────────────────────────────
        kpi_score = process.score_iso or 0

        kpi_score = min(100, max(0, kpi_score))

        # ─────────────────────────────
        # 2. NON-CONFORMITY SCORE (25%)
        # ─────────────────────────────
        nc = NonConformite.objects.filter(processus=process)

        total_nc = nc.count()
        critical_nc = nc.filter(gravite="critique").count()

        nc_score = 100 - (critical_nc * 25 + total_nc * 10)
        nc_score = max(0, nc_score)

        # ─────────────────────────────
        # 3. AUDIT SCORE (20%)
        # ─────────────────────────────
        audits = Audit.objects.filter(processus=process)

        if audits.exists():
            audit_penalty = audits.filter(etat_audit="non_conforme").count() * 20
            audit_score = max(0, 100 - audit_penalty)
        else:
            audit_score = 70  # neutral baseline

        # ─────────────────────────────
        # 4. ACTION PLAN SCORE (15%)
        # ─────────────────────────────
        actions = PlanAction.objects.filter(processus=process)

        done = actions.filter(statut="termine").count()
        total = actions.count()

        action_score = (done / total * 100) if total > 0 else 80

        # ─────────────────────────────
        # FINAL WEIGHTED SCORE
        # ─────────────────────────────
        final_score = process.score_iso or 0

        return {
            "kpi_score": round(kpi_score, 1),
            "nc_score": round(nc_score, 1),
            "audit_score": round(audit_score, 1),
            "action_score": round(action_score, 1),
            "final_score": round(final_score, 1),
        }
    
    

class ProcessusDashboardView(APIView):
    permission_classes = [IsAnyRole]

    def get(self, request):
        user = request.user
        qs = Processus.objects.all()

        if getattr(user, "role", Utilisateur.PILOTE) == Utilisateur.METIER:
            qs = qs.filter(pilote=user)

        data = []

        for p in qs:
            metrics = KPIEngine.compute_process_score(p)

            score = metrics["final_score"]

            data.append({
                "id": p.id,
                "name": p.designation,
                "category": p.type_processus,
                "score": score,
                "kpis": metrics,
            "status": (
                "conforme" if score >= 70 else
                "partiel" if score >= 50 else
                "non_conforme"
            )
            })

        return Response(data)
    
class ProcessusEvaluationView(APIView):
    permission_classes = [IsAnyRole]

    def get(self, request, pk):
        process = get_object_or_404(Processus, pk=pk)

        metrics = KPIEngine.compute_process_score(process)
        score = metrics["final_score"]

        clauses = [
            metrics["kpi_score"],
            metrics["nc_score"],
            metrics["audit_score"],
            metrics["action_score"],
            score,
            max(0, score - 10),
            max(0, score - 15),
        ]

        return Response({
            "process": process.designation,
            "score": score,
            "breakdown": metrics,
            "clauses": clauses,
            "status": (
                "conforme" if score >= 70 else
                "partiel" if score >= 50 else
                "non conforme"
            ),
            "recommendations": self.generate_reco(metrics)
        })

    def generate_reco(self, m):
        reco = []

        if m["kpi_score"] < 70:
            reco.append("Améliorer les KPI et leur mesure")

        if m["nc_score"] < 70:
            reco.append("Réduire les non-conformités critiques")

        if m["audit_score"] < 70:
            reco.append("Renforcer les audits internes")

        if m["action_score"] < 70:
            reco.append("Accélérer la clôture des plans d'action")

        return reco
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.utils.timezone import now

from .models import (
    Processus,
    PlanAction,
    NonConformite,
    Utilisateur
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils.timezone import now

from .models import Processus, PlanAction, NonConformite, Utilisateur
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils.timezone import now

class DashboardView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        # ─────────────────────────────
        # INPUT
        # ─────────────────────────────
        email = request.data.get("email")
        role = request.data.get("role")

        if not email or not role:
            return Response(
                {"error": "email and role are required"},
                status=400
            )

        # ─────────────────────────────
        # FILTERING
        # ─────────────────────────────
        if role == Utilisateur.PILOTE:
            processus_qs = Processus.objects.select_related("pilote", "structure")
            actions_qs = PlanAction.objects.select_related("processus", "responsable")
            nc_qs = NonConformite.objects.select_related("processus")
        else:
            processus_qs = Processus.objects.filter(
                pilote__email=email
            ).select_related("pilote", "structure")

            actions_qs = PlanAction.objects.filter(
                responsable__email=email
            ).select_related("processus", "responsable")

            nc_qs = NonConformite.objects.filter(
                processus__pilote__email=email
            ).select_related("processus")

        # ─────────────────────────────
        # GLOBAL SCORE
        # ─────────────────────────────
        total_processes = processus_qs.count()
        global_score = round(sum(p.score_iso or 0 for p in processus_qs) / total_processes) if total_processes else 0

        # ─────────────────────────────
        # PROCESS LIST
        # ─────────────────────────────
        process_list = []

        for p in processus_qs:
            score = p.score_iso or 0

            process_list.append({
                "id": p.id,
                "name": p.designation,
                "type": p.structure.type_structure if p.structure else "Non défini",
                "score": score,
                "statut": (
                    "conforme" if score >= 70 else
                    "partiel" if score >= 50 else
                    "nonConforme"
                )
            })

        # ─────────────────────────────
        # URGENT ACTIONS
        # ─────────────────────────────
        urgent_list = [
            {
                "id": a.id,
                "processus": a.processus.designation,
                "action": a.action,
                "clause": a.clause.code if hasattr(a, "clause") and a.clause else "ISO",
                "responsable": f"{a.responsable.prenom} {a.responsable.nom}" if a.responsable else "-",
                "delai": a.delai,
                "priorite": a.priorite,
                "statut": a.statut,
            }
            for a in actions_qs.filter(priorite__iexact="urgente")
        ]

        # ─────────────────────────────
        # RETARD ACTIONS
        # ─────────────────────────────
        today = now().date()

        retard_list = [
            {
                "id": a.id,
                "processus": a.processus.designation,
                "action": a.action,
                "clause": a.clause.code if hasattr(a, "clause") and a.clause else "ISO",
                "responsable": f"{a.responsable.prenom} {a.responsable.nom}" if a.responsable else "-",
                "delai": a.delai,
                "priorite": a.priorite,
                "statut": "En retard",
            }
            for a in actions_qs.filter(delai__lt=today).exclude(statut="termine")
        ]

        # ─────────────────────────────
        # CLAUSE SCORES (FIXED)
        # ─────────────────────────────
        clause_scores = []

        exigences = Exigence.objects.prefetch_related("items").all()

        for ex in exigences:

            items = ex.items.all()
            total_items = items.count()

            if total_items == 0:
                score = 0
            else:
                validated_items = ExigenceValidation.objects.filter(
                    item__exigence=ex,
                    is_validated=True
                ).count()

                score = round((validated_items / total_items) * 100)

            # HARD SAFETY (never exceed 100)
            score = min(score, 100)

            clause_scores.append({
                "clause": ex.code,
                "title": ex.titre,
                "score": score
            })

        # ─────────────────────────────
        # RESPONSE
        # ─────────────────────────────
        return Response({
            "globalScore": global_score,
            "urgentActions": urgent_list,
            "retardActions": retard_list,
            "processes": process_list,
            "clauseScores": clause_scores,
            "nonConformites": nc_qs.count(),
        })
    

    class ChecklistView(APIView):
     permission_classes = [AllowAny]

    def get(self, request):

        processus_id = request.query_params.get("processus_id")

        if not processus_id:
            return Response({"error": "processus_id required"}, status=400)

        exigences = Exigence.objects.prefetch_related("items").all()

        data = []

        for ex in exigences:

            items_data = []

            for item in ex.items.all():

                validation = ExigenceValidation.objects.filter(
                    processus_id=processus_id,
                    item=item
                ).first()

                items_data.append({
                    "id": item.id,
                    "text": item.text,
                    "validated": validation.is_validated if validation else False
                })

            data.append({
                "id": ex.id,
                "code": ex.code,
                "titre": ex.titre,
                "items": items_data
            })

        return Response({"exigences": data})




class ExigenceChecklistView(APIView):
    def get(self, request):
        exigences = Exigence.objects.prefetch_related("items").all()

        data = []

        for exigence in exigences:
            data.append({
                "id": exigence.id,
                "code": exigence.code,
                "titre": exigence.titre,
                "items": [
                    {
                        "id": item.id,
                        "text": item.text,
                    }
                    for item in exigence.items.all()
                ]
            })

        return Response(data, status=status.HTTP_200_OK)