import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Commande, CommandeService, ResumeMarche, ResumeConsultation } from '../../services/commande';
import { MarcheService } from '../../services/marche';
import { ConsultationService } from '../../services/consultation';
import { ToastService } from '../../services/toast';
import { ConfirmDialogService } from '../../services/confirm-dialog';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [SidebarComponent, FormsModule, DecimalPipe],
  templateUrl: './commandes.html',
  styleUrl: './commandes.css',
})
export class Commandes implements OnInit {

  showForm = false;
  modeEdition = false;
  idCommandeEnCours?: number;

  commandes: any[] = [];
  keyword = '';
  marches: any[] = [];
  consultationsRetenues: any[] = [];

  origineCommande: 'MARCHE' | 'CONSULTATION' = 'MARCHE';

  marcheSelectionne: any | null = null;
  consultationSelectionnee: any | null = null;

  resumeMarche: ResumeMarche | null = null;

  resumeConsultation: ResumeConsultation | null = null;

  nouvelleCommande: Commande = {
    numeroCommande: '',
    dateCommande: '',
    montantCommande: 0,
    statut: 'EN_COURS',
    marche: {
      id: 0
    },
    consultation: null
  };

  constructor(
    private commandeService: CommandeService,
    private marcheService: MarcheService,
    private consultationService: ConsultationService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.chargerCommandes();
    this.chargerMarches();
    this.chargerConsultationsRetenues();
  }

  chargerCommandes(): void {
    this.commandeService.getCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Erreur chargement commandes', err);
      }
    });
  }

  chargerMarches(): void {
    this.marcheService.getMarches().subscribe({
      next: (data) => {
        this.marches = data;
      },
      error: (err) => {
        console.log('Erreur chargement marchés', err);
      }
    });
  }

  chargerConsultationsRetenues(): void {

    this.consultationService
      .getConsultations()
      .subscribe({

        next: (data) => {

          console.log('Toutes les consultations :', data);

          this.consultationsRetenues =
            data.filter(
              consultation =>
                consultation.statut?.toUpperCase() === 'RETENUE'
            );

          console.log(
            'Consultations retenues :',
            this.consultationsRetenues
          );

          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement consultations',
            err
          );

          this.toastService.error(
            'Impossible de charger les consultations retenues'
          );
        }
      });
  }

changerOrigineCommande(
  origine: 'MARCHE' | 'CONSULTATION'
): void {

  this.origineCommande = origine;

  this.marcheSelectionne = null;
  this.consultationSelectionnee = null;

  this.resumeMarche = null;
  this.resumeConsultation = null;

  this.nouvelleCommande.montantCommande = 0;

  if (origine === 'MARCHE') {

    this.nouvelleCommande.marche = {
      id: 0
    };

    this.nouvelleCommande.consultation = null;

  } else {

    this.nouvelleCommande.marche = null;

    this.nouvelleCommande.consultation = {
      id: 0
    };
  }
}

mettreAJourMarcheSelectionne(
  idMarche: number
): void {

  this.marcheSelectionne =
    this.marches.find(
      marche =>
        Number(marche.id) === Number(idMarche)
    ) ?? null;

  this.resumeMarche = null;

  if (!this.marcheSelectionne) {
    this.nouvelleCommande.montantCommande = 0;
    return;
  }

  this.commandeService
    .getResumeMarche(idMarche)
    .subscribe({

      next: (resume) => {
        this.resumeMarche = resume;
        this.cd.detectChanges();
      },

      error: (err) => {
        console.error(
          'Erreur chargement résumé marché',
          err
        );

        this.resumeMarche = null;

        this.toastService.error(
          'Impossible de charger les montants du marché'
        );
      }
    });
}

mettreAJourConsultationSelectionnee(
  consultationId: number
): void {

  this.consultationSelectionnee =
    this.consultationsRetenues.find(
      consultation =>
        Number(consultation.id) ===
        Number(consultationId)
    ) ?? null;

  this.resumeConsultation = null;

  if (!this.consultationSelectionnee) {
    this.nouvelleCommande.montantCommande = 0;
    return;
  }

  this.commandeService
    .getResumeConsultation(consultationId)
    .subscribe({

      next: (resume) => {

        this.resumeConsultation = resume;

        this.cd.detectChanges();
      },

      error: (err) => {

        console.error(
          'Erreur chargement résumé consultation',
          err
        );

        this.resumeConsultation = null;

        this.toastService.error(
          'Impossible de charger les montants de la consultation'
        );
      }
    });
}

ouvrirFormulaire(): void {

    this.modeEdition = false;
    this.idCommandeEnCours = undefined;

    this.nouvelleCommande = {
      numeroCommande: '',
      dateCommande: '',
      montantCommande: 0,
      statut: 'EN_COURS',
      marche: {
        id: 0
      },
      consultation: null
    };

    this.marcheSelectionne = null;
    this.consultationSelectionnee = null;

    this.resumeMarche = null;
    this.resumeConsultation = null;

    this.showForm = true;
  }

enregistrerCommande(): void {

  if (
    !this.nouvelleCommande.numeroCommande.trim() ||
    !this.nouvelleCommande.dateCommande ||
    this.nouvelleCommande.montantCommande <= 0
  ) {
    this.toastService.warning(
      'Veuillez remplir correctement tous les champs'
    );
    return;
  }

  if (this.origineCommande === 'MARCHE') {

    if (
      !this.nouvelleCommande.marche ||
      this.nouvelleCommande.marche.id === 0
    ) {
      this.toastService.warning(
        'Veuillez sélectionner un marché'
      );
      return;
    }

  }

  if (this.origineCommande === 'CONSULTATION') {

    if (
      !this.nouvelleCommande.consultation ||
      this.nouvelleCommande.consultation.id === 0
    ) {
      this.toastService.warning(
        'Veuillez sélectionner une consultation'
      );
      return;
    }

  }

  if (this.origineCommande === 'MARCHE') {

    if (!this.marcheSelectionne) {
      this.toastService.warning(
        'Le marché sélectionné est introuvable'
      );
      return;
    }

    if (!this.resumeMarche) {
      this.toastService.warning(
        'Veuillez attendre le chargement des informations du marché'
      );
      return;
    }

    if (
      !this.modeEdition &&
      this.nouvelleCommande.montantCommande >
      this.resumeMarche.montantRestant
    ) {
      this.toastService.warning(
        `Le montant dépasse le reste disponible : ${
          this.resumeMarche.montantRestant
        } DH`
      );
      return;
    }

    if (
      this.nouvelleCommande.montantCommande >
      Number(this.marcheSelectionne.montantMarche ?? 0)
    ) {
      this.toastService.warning(
        'Le montant de la commande dépasse le montant du marché'
      );
      return;
    }

    this.nouvelleCommande.consultation = null;
  }

  if (this.origineCommande === 'CONSULTATION') {

    if (!this.consultationSelectionnee) {
      this.toastService.warning(
        'La consultation sélectionnée est introuvable'
      );
      return;
    }

    if (!this.resumeConsultation) {
      this.toastService.warning(
        'Veuillez attendre le chargement des informations de la consultation'
      );
      return;
    }

    if (
      !this.modeEdition &&
      this.nouvelleCommande.montantCommande >
      this.resumeConsultation.montantRestant
    ) {

      this.toastService.warning(
        `Le montant dépasse le reste disponible : ${
          this.resumeConsultation.montantRestant
        } DH`
      );

      return;
    }

    this.nouvelleCommande.marche = null;
  }
  if (
    this.modeEdition &&
    this.idCommandeEnCours !== undefined
  ) {

    this.commandeService
      .updateCommande(
        this.idCommandeEnCours,
        this.nouvelleCommande
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Commande modifiée avec succès'
          );

          this.showForm = false;
          this.modeEdition = false;
          this.idCommandeEnCours = undefined;

          this.chargerCommandes();
        },

        error: (err) => {

          console.error(
            'Erreur modification commande',
            err
          );

          const message =
            err?.error?.detail
            || err?.error?.message
            || (
              typeof err?.error === 'string'
                ? err.error
                : null
            )
            || 'Erreur lors de la modification de la commande';

          this.toastService.error(message);
        }
        });

    return;
  }

  this.commandeService
    .saveCommande(this.nouvelleCommande)
    .subscribe({

      next: () => {

        this.toastService.success(
          'Commande enregistrée avec succès'
        );

        this.showForm = false;

        this.chargerCommandes();
      },

      error: (err) => {

        console.error(
          'Erreur enregistrement commande',
          err
        );

        const message =
          err?.error?.message
          || 'Erreur lors de l’enregistrement de la commande';

        this.toastService.error(message);
      }
    });
}

modifierCommande(commande: any): void {

  this.modeEdition = true;
  this.idCommandeEnCours = commande.id;
  this.showForm = true;

  this.resumeMarche = null;
  this.resumeConsultation = null;

  this.marcheSelectionne = null;
  this.consultationSelectionnee = null;


  // ==========================
  // COMMANDE LIÉE À UN MARCHÉ
  // ==========================

  if (commande.marche) {

    this.origineCommande = 'MARCHE';

    this.nouvelleCommande = {
      numeroCommande: commande.numeroCommande,
      dateCommande: commande.dateCommande,
      montantCommande: commande.montantCommande,
      statut: commande.statut,

      marche: {
        id: Number(commande.marche.id)
      },

      consultation: null
    };

    this.mettreAJourMarcheSelectionne(
      Number(commande.marche.id)
    );

    return;
  }


  // ================================
  // COMMANDE LIÉE À UNE CONSULTATION
  // ================================

  if (commande.consultation) {

    this.origineCommande = 'CONSULTATION';

    this.nouvelleCommande = {
      numeroCommande: commande.numeroCommande,
      dateCommande: commande.dateCommande,
      montantCommande: commande.montantCommande,
      statut: commande.statut,

      marche: null,

      consultation: {
        id: Number(commande.consultation.id)
      }
    };

    this.mettreAJourConsultationSelectionnee(
      Number(commande.consultation.id)
    );

    return;
  }


  // ==========================
  // CAS ANORMAL
  // ==========================

  this.toastService.warning(
    'Cette commande ne possède ni marché ni consultation'
  );
}

supprimerCommande(id: number): void {

  this.confirmDialogService.open({

    title: 'Supprimer la commande',

    message:
      'Voulez-vous vraiment supprimer cette commande ? Cette action est irréversible.',

    confirmText: 'Supprimer',

    cancelText: 'Annuler',

    onConfirm: () => {

      this.commandeService
        .deleteCommande(id)
        .subscribe({

          next: () => {

            this.toastService.success(
              'Commande supprimée avec succès'
            );

            this.chargerCommandes();
          },

          error: (err) => {

            console.error(
              'Erreur suppression commande',
              err
            );

            this.toastService.error(
              'Erreur lors de la suppression de la commande'
            );
          }
        });
    }
  });
}

rechercherCommandes(): void {

  const recherche = this.keyword.trim();

  if (!recherche) {
    this.chargerCommandes();
    return;
  }

  this.commandeService
    .searchCommandes(recherche)
    .subscribe({

      next: (data) => {

        this.commandes = data;

        this.cd.detectChanges();

        if (data.length === 0) {
          this.toastService.info(
            'Aucune commande trouvée'
          );
        }
      },

      error: (err) => {

        console.error(
          'Erreur recherche commandes',
          err
        );

        this.toastService.error(
          'Erreur lors de la recherche des commandes'
        );
      }
    });
}

reinitialiserRecherche(): void {
  this.keyword = '';
  this.chargerCommandes();
}

exporterExcel(): void {

  this.commandeService
    .exportExcel()
    .subscribe({

      next: (blob) => {

        const url =
          window.URL.createObjectURL(blob);

        const lien =
          document.createElement('a');

        lien.href = url;
        lien.download = 'commandes.xlsx';

        lien.click();

        window.URL.revokeObjectURL(url);

        this.toastService.success(
          'Export Excel téléchargé avec succès'
        );
      },

      error: (err) => {

        console.error(
          'Erreur export Excel Commandes',
          err
        );

        this.toastService.error(
          'Erreur lors de l’export Excel des commandes'
        );
      }
    });
}

exporterPdf(id: number): void {

  this.commandeService
    .exportPdf(id)
    .subscribe({

      next: (blob) => {

        const url =
          window.URL.createObjectURL(blob);

        const lien =
          document.createElement('a');

        lien.href = url;
        lien.download = `commande_${id}.pdf`;

        lien.click();

        window.URL.revokeObjectURL(url);

        this.toastService.success(
          'PDF téléchargé avec succès'
        );
      },

      error: (err) => {

        console.error(
          'Erreur export PDF Commande',
          err
        );

        this.toastService.error(
          'Erreur lors de l’export PDF de la commande'
        );
      }
    });
}


}
