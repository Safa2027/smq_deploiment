from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (
    ExigenceItem, ExigenceValidation, Utilisateur, Structure, Processus, Tache, InfoDocumentee,
    Contrainte, Anomalie, KPI, KPIProcessus, Moyens,
    Exigence, NonConformite, Audit, PlanAction,
)


# ══════════════════════════════════════════════
# AUTH
# ══════════════════════════════════════════════

class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Email ou mot de passe incorrect.")
        if not user.is_active:
            raise serializers.ValidationError("Ce compte est désactivé.")
        data['user'] = user
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = Utilisateur
        fields = ['nom', 'prenom', 'email', 'telephone', 'role', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password2": "Les mots de passe ne correspondent pas."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = Utilisateur(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ══════════════════════════════════════════════
# UTILISATEUR
# ══════════════════════════════════════════════

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Utilisateur
        fields = ['id', 'nom', 'prenom', 'email', 'role', 'telephone', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class UtilisateurBriefSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model  = Utilisateur
        fields = ['id', 'full_name', 'email', 'role']

    def get_full_name(self, obj):
        return f"{obj.prenom} {obj.nom}"


# ══════════════════════════════════════════════
# STRUCTURE
# ══════════════════════════════════════════════

class StructureSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Structure
        fields = '__all__'


# ══════════════════════════════════════════════
# TACHE
# ══════════════════════════════════════════════

class TacheSerializer(serializers.ModelSerializer):
    class Meta:
        model        = Tache
        fields       = '__all__'
        read_only_fields = ['id']


# ══════════════════════════════════════════════
# INFO DOCUMENTÉE
# ══════════════════════════════════════════════

class InfoDocumenteeSerializer(serializers.ModelSerializer):
    class Meta:
        model        = InfoDocumentee
        fields       = '__all__'
        read_only_fields = ['id']


# ══════════════════════════════════════════════
# CONTRAINTE
# ══════════════════════════════════════════════

class ContrainteSerializer(serializers.ModelSerializer):
    class Meta:
        model        = Contrainte
        fields       = '__all__'
        read_only_fields = ['id']


# ══════════════════════════════════════════════
# ANOMALIE
# ══════════════════════════════════════════════

class AnomalieSerializer(serializers.ModelSerializer):
    class Meta:
        model        = Anomalie
        fields       = '__all__'
        read_only_fields = ['id', 'created_at']


# ══════════════════════════════════════════════
# KPI
# ══════════════════════════════════════════════

class KPISerializer(serializers.ModelSerializer):
    class Meta:
        model        = KPI
        fields       = '__all__'
        read_only_fields = ['id']


class KPIProcessusSerializer(serializers.ModelSerializer):
    kpi_detail = KPISerializer(source='kpi', read_only=True)

    class Meta:
        model        = KPIProcessus
        fields       = ['id', 'processus', 'kpi', 'kpi_detail', 'frequence']
        read_only_fields = ['id']


# ══════════════════════════════════════════════
# MOYENS
# ══════════════════════════════════════════════

class MoyensSerializer(serializers.ModelSerializer):
    class Meta:
        model        = Moyens
        fields       = '__all__'
        read_only_fields = ['id']


# ══════════════════════════════════════════════
# EXIGENCE
# ══════════════════════════════════════════════

class ExigenceSerializer(serializers.ModelSerializer):
    class Meta:
        model        = Exigence
        fields       = '__all__'
        read_only_fields = ['id']



class ExigenceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model        = ExigenceItem
        fields       = '__all__'
        read_only_fields = ['id']

class ExigenceValidationSerializer(serializers.ModelSerializer):
    exigence_item_detail = ExigenceItemSerializer(source='item', read_only=True)

    class Meta:
        model        = ExigenceValidation
        fields       = ['id', 'processus', 'item', 'exigence_item_detail', 'is_validated']
        read_only_fields = ['id']
        

# ══════════════════════════════════════════════
# NON-CONFORMITE
# ══════════════════════════════════════════════

class NonConformiteSerializer(serializers.ModelSerializer):
    exigence_detail = ExigenceSerializer(source='exigence', read_only=True)

    class Meta:
        model        = NonConformite
        fields       = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


# ══════════════════════════════════════════════
# AUDIT
# ══════════════════════════════════════════════

class AuditSerializer(serializers.ModelSerializer):
    auditeur_detail = UtilisateurBriefSerializer(source='auditeur', read_only=True)
    auditeur_name = serializers.SerializerMethodField()
    processus_name = serializers.SerializerMethodField()

    class Meta:
        model        = Audit
        fields       = '__all__'
        read_only_fields = ['id', 'created_at']

    def get_auditeur_name(self, obj):
        if not obj.auditeur:
            return ""
        return f"{obj.auditeur.prenom} {obj.auditeur.nom}"

    def get_processus_name(self, obj):
        return obj.processus.designation if obj.processus else ""


# ══════════════════════════════════════════════
# PLAN ACTION
# ══════════════════════════════════════════════

class PlanActionSerializer(serializers.ModelSerializer):
    responsable_detail = UtilisateurBriefSerializer(source='responsable', read_only=True)
    exigence_detail    = ExigenceSerializer(source='exigence', read_only=True)
    responsable_name = serializers.SerializerMethodField()
    processus_name = serializers.SerializerMethodField()

    class Meta:
        model        = PlanAction
        fields       = '__all__'
        read_only_fields = ['id', 'created_at']

    def get_responsable_name(self, obj):
        if not obj.responsable:
            return ""
        return f"{obj.responsable.prenom} {obj.responsable.nom}"

    def get_processus_name(self, obj):
        return obj.processus.designation if obj.processus else ""


# ══════════════════════════════════════════════
# PROCESSUS
# ══════════════════════════════════════════════

class ProcessusListSerializer(serializers.ModelSerializer):
    """Résumé léger pour la liste."""
    pilote_detail    = UtilisateurBriefSerializer(source='pilote', read_only=True)
    structure_detail = StructureSerializer(source='structure', read_only=True)
    nb_nc            = serializers.SerializerMethodField()
    nb_actions       = serializers.SerializerMethodField()
    has_fiche        = serializers.SerializerMethodField()

    class Meta:
        model  = Processus
        fields = [
            'id', 'designation', 'type_processus', 'etat_pr', 'score_iso',
            'pilote_detail', 'structure_detail',
            'nb_nc', 'nb_actions', 'has_fiche', 'created_at', 'updated_at',
        ]

    def get_nb_nc(self, obj):
        return obj.non_conformites.count()

    def get_nb_actions(self, obj):
        return obj.plan_actions.filter(statut__in=['en_attente', 'en_cours']).count()

    def get_has_fiche(self, obj):
        return (
            hasattr(obj, 'moyens') or
            obj.contraintes.exists() or
            obj.anomalies.exists() or
            obj.kpis.exists() or
            obj.documents.exists() or
            obj.etat_pr in ["fiche_deposee", "conforme", "non_conforme", "valide"]
        )


class ProcessusDetailSerializer(serializers.ModelSerializer):
    """Détail complet avec tous les objets imbriqués (lecture)."""
    pilote_detail    = UtilisateurBriefSerializer(source='pilote', read_only=True)
    structure_detail = StructureSerializer(source='structure', read_only=True)
    taches           = TacheSerializer(many=True, read_only=True)
    documents        = InfoDocumenteeSerializer(many=True, read_only=True)
    contraintes      = ContrainteSerializer(many=True, read_only=True)
    anomalies        = AnomalieSerializer(many=True, read_only=True)
    kpis             = KPIProcessusSerializer(many=True, read_only=True)
    moyens           = MoyensSerializer(read_only=True)
    exigences        = ExigenceValidationSerializer(many=True, read_only=True)
    non_conformites  = NonConformiteSerializer(many=True, read_only=True)
    audits           = AuditSerializer(many=True, read_only=True)
    plan_actions     = PlanActionSerializer(many=True, read_only=True)

    class Meta:
        model        = Processus
        fields       = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProcessusWriteSerializer(serializers.ModelSerializer):
    """Écriture allégée (POST / PUT / PATCH)."""
    class Meta:
        model        = Processus
        fields       = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


# ══════════════════════════════════════════════
# DASHBOARD STATS
# ══════════════════════════════════════════════

class DashboardStatsSerializer(serializers.Serializer):
    total_processus         = serializers.IntegerField()
    processus_valides       = serializers.IntegerField()
    total_nc                = serializers.IntegerField()
    nc_ouvertes             = serializers.IntegerField()
    nc_critiques            = serializers.IntegerField()
    total_actions           = serializers.IntegerField()
    actions_en_cours        = serializers.IntegerField()
    total_audits            = serializers.IntegerField()
    audits_planifies        = serializers.IntegerField()
    taux_conformite_pct     = serializers.FloatField()
