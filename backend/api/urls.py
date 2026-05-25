from django.urls import path
from . import views

urlpatterns = [

    # AUTH
    path('auth/login/', views.LoginView.as_view()),
    path('auth/logout/', views.LogoutView.as_view()),
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/me/', views.MeView.as_view()),
    path("auth/reset-password/", views.ResetPasswordRequestView.as_view()),
    path(
        "api/exigences/",
        views.ExigenceChecklistView.as_view()
    ),

    # DASHBOARD
    path('dashboard/', views.DashboardView.as_view()),
    path('checklist/', views.ChecklistView.as_view()),

    # UTILISATEURS
    path('utilisateurs/', views.UtilisateurListView.as_view()),
    path('utilisateurs/<int:pk>/', views.UtilisateurDetailView.as_view()),

    # STRUCTURES
    path('structures/', views.StructureListCreateView.as_view()),
    path('structures/<int:pk>/', views.StructureDetailView.as_view()),

    # PROCESSUS
    path('processus/', views.ProcessusListView.as_view()),
    path('processus/create/', views.ProcessusCreateView.as_view()),
    path('processus/<int:pk>/', views.ProcessusDetailView.as_view()),
    path('processus/<int:pk>/valider/', views.ProcessusValiderView.as_view()),
    path("processus/add-fiche/", views.AddFicheProcessusView.as_view()),

    # SOUS PROCESSUS
    path('processus/<int:pr_pk>/taches/', views.TacheListCreateView.as_view()),
    path('processus/<int:pr_pk>/documents/', views.InfoDocumenteeListCreateView.as_view()),
    path('processus/<int:pr_pk>/contraintes/', views.ContrainteListCreateView.as_view()),
    path('processus/<int:pr_pk>/anomalies/', views.AnomalieListCreateView.as_view()),
    path('processus/<int:pr_pk>/kpis/', views.KPIProcessusListCreateView.as_view()),
    path('processus/<int:pr_pk>/moyens/', views.MoyensView.as_view()),

    # KPI / EXIGENCES
    path('kpis/', views.KPIListCreateView.as_view()),
    path('exigences/', views.ExigenceListCreateView.as_view()),

    # NON CONFORMITE
    path('non-conformites/', views.NonConformiteListCreateView.as_view()),
    path('non-conformites/<int:pk>/', views.NonConformiteDetailView.as_view()),

    # AUDITS
    path('audits/', views.AuditListCreateView.as_view()),
    path('audits/<int:pk>/', views.AuditDetailView.as_view()),

    # PLAN ACTION
    path('plan-actions/', views.PlanActionListCreateView.as_view()),
    path('plan-actions/<int:pk>/', views.PlanActionDetailView.as_view()),

path('processus/dashboard/', views.ProcessusDashboardView.as_view()),
path('processus/<int:pk>/evaluation/', views.ProcessusEvaluationView.as_view()),
path('processus/<int:pk>/checklist/', views.ChecklistProcessView.as_view()),
path("dashboard/", views.DashboardView.as_view()),
]
