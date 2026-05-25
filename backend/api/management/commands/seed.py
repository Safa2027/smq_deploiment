from django.core.management.base import BaseCommand
from faker import Faker
import random

from api.models import (
    Utilisateur, Structure, Processus, Tache, InfoDocumentee,
    Contrainte, Anomalie, KPI, KPIProcessus,
    Moyens, Exigence, ExigenceItem, ExigenceValidation,
    NonConformite, Audit, PlanAction
)

fake = Faker()


class Command(BaseCommand):
    help = "Seed database with realistic fake data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old data...")

        models = [
            PlanAction, Audit, NonConformite, ExigenceValidation,
            ExigenceItem, Exigence, KPIProcessus, KPI,
            Anomalie, Contrainte, InfoDocumentee, Tache,
            Moyens, Processus, Structure, Utilisateur
        ]

        for m in models:
            m.objects.all().delete()

        self.stdout.write("Creating users...")

        users = []
        roles = [
            Utilisateur.METIER,
            Utilisateur.PILOTE,
            Utilisateur.AUDITEUR_INTERNE,
            Utilisateur.AUDITEUR_EXTERNE
        ]

        for _ in range(30):
            user = Utilisateur.objects.create_user(
                email=fake.unique.email(),
                password="123456",
                nom=fake.last_name(),
                prenom=fake.first_name(),
                role=random.choice(roles),
                telephone=fake.phone_number()
            )
            users.append(user)

        self.stdout.write("Creating structures...")

        structures = []
        for _ in range(10):
            s = Structure.objects.create(
                nom_structure=fake.company(),
                type_structure=random.choice(["Direction", "Service", "Département"])
            )
            structures.append(s)

        self.stdout.write("Creating processes...")

        processes = []
        for _ in range(25):
            p = Processus.objects.create(
                designation=fake.job(),
                objectif=fake.text(max_nb_chars=200),
                type_processus=random.choice(["Support", "Management", "Réalisation"]),
                pilote=random.choice(users),
                structure=random.choice(structures),
                etat_pr=random.choice(["brouillon", "validé", "actif"]),
                score_iso=random.randint(40, 100)
            )
            processes.append(p)

        self.stdout.write("Creating tasks, docs, constraints...")

        for p in processes:
            for _ in range(random.randint(2, 6)):
                Tache.objects.create(
                    processus=p,
                    nom=fake.sentence(nb_words=4),
                    numero=str(random.randint(1, 100))
                )

            for _ in range(random.randint(1, 3)):
                InfoDocumentee.objects.create(
                    processus=p,
                    nom_document=fake.file_name(extension="pdf"),
                    lien=fake.url()
                )

            for _ in range(random.randint(1, 3)):
                Contrainte.objects.create(
                    processus=p,
                    description=fake.text(max_nb_chars=120)
                )

            for _ in range(random.randint(0, 3)):
                Anomalie.objects.create(
                    processus=p,
                    description=fake.text(max_nb_chars=120)
                )

        self.stdout.write("Creating KPIs...")

        kpis = []
        for _ in range(15):
            k = KPI.objects.create(
                indicateur=fake.bs(),
                cible=f"{random.randint(70, 99)}%"
            )
            kpis.append(k)

        for p in processes:
            for _ in range(random.randint(1, 3)):
                KPIProcessus.objects.create(
                    processus=p,
                    kpi=random.choice(kpis),
                    frequence=random.choice(["Mensuel", "Trimestriel", "Annuel"])
                )

        self.stdout.write("Creating means...")

        for p in processes:
            Moyens.objects.create(
                processus=p,
                description=fake.text(max_nb_chars=150)
            )

        self.stdout.write("Creating ISO requirements...")

        exigences = []
        for _ in range(5):
            e = Exigence.objects.create(
                code=f"ISO {random.randint(1, 9)}.{random.randint(1, 9)}",
                titre=fake.sentence(nb_words=5)
            )
            exigences.append(e)

            for _ in range(random.randint(3, 6)):
                ExigenceItem.objects.create(
                    exigence=e,
                    text=fake.text(max_nb_chars=100)
                )

        items = list(ExigenceItem.objects.all())

        for p in processes:
            for item in random.sample(items, k=random.randint(2, 5)):
                ExigenceValidation.objects.create(
                    processus=p,
                    item=item,
                    is_validated=random.choice([True, False])
                )

        self.stdout.write("Creating audits...")

        for _ in range(20):
            Audit.objects.create(
                processus=random.choice(processes),
                auditeur=random.choice(users),
                titre=fake.sentence(nb_words=4),
                clause=f"Clause {random.randint(1, 10)}",
                date_audit=fake.date_this_year(),
                etat_audit=random.choice(["planifie", "en_cours", "terminé"]),
                score=random.randint(50, 100)
            )

        self.stdout.write("Creating non conformities + actions...")

        for _ in range(30):
            nc = NonConformite.objects.create(
                processus=random.choice(processes),
                description=fake.text(max_nb_chars=120),
                gravite=random.choice(["faible", "moyenne", "haute"]),
                etat_nc=random.choice(["ouverte", "en_cours", "résolue"])
            )

            PlanAction.objects.create(
                processus=nc.processus,
                responsable=random.choice(users),
                action=fake.text(max_nb_chars=120),
                clause=f"ISO {random.randint(1, 9)}.{random.randint(1, 9)}",
                statut=random.choice(["en_cours", "terminé", "bloqué"]),
                priorite=random.choice(["faible", "moyenne", "haute"]),
                delai=fake.future_date()
            )

        self.stdout.write(self.style.SUCCESS("Database successfully seeded 🚀"))