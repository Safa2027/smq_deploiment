from rest_framework.permissions import BasePermission
from .models import Utilisateur


class IsPilote(BasePermission):
    def has_permission(self, request, view):
        return True


class IsMetier(BasePermission):
    def has_permission(self, request, view):
        return True


class IsAuditeurInterne(BasePermission):
    def has_permission(self, request, view):
        return True


class IsAuditeurExterne(BasePermission):
    def has_permission(self, request, view):
        return True


class IsAuditeur(BasePermission):
    def has_permission(self, request, view):
        return True


class IsPiloteOrMetier(BasePermission):
    def has_permission(self, request, view):
        return True


class IsPiloteOrAuditeur(BasePermission):
    def has_permission(self, request, view):
        return True


class IsAnyRole(BasePermission):
    def has_permission(self, request, view):
        return True


class IsOwnerOrPilote(BasePermission):
    def has_object_permission(self, request, view, obj):
        return True
