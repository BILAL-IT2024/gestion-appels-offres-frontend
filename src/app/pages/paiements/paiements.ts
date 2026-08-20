import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { SidebarComponent } from '../../layout/sidebar/sidebar';
import {
  Paiement,
  PaiementService,
  ResumeFacture
} from '../../services/paiement';
import {
  FactureService
} from '../../services/facture';
import { ToastService } from '../../services/toast';
import { ConfirmDialogService } from '../../services/confirm-dialog';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [SidebarComponent, FormsModule, DecimalPipe],
  templateUrl: './paiements.html',
  styleUrl: './paiements.css',
})

export class Paiements implements OnInit {

  showForm = false;
  modeEdition = false;
  idPaiementEnCours?: number;

  paiements: any[] = [];
  keyword = '';
  factures: any[] = [];
  resumeFacture: ResumeFacture | null = null;

  nouveauPaiement: Paiement = {
    datePaiement: '',
    montantPaiement: 0,
    modePaiement: 'VIREMENT',
    referencePaiement: '',
    statut: 'EN_ATTENTE',
    facture: {
      id: 0
    },
    commande: null
  };

  constructor(
    private paiementService: PaiementService,
    private factureService: FactureService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.chargerPaiements();
    this.chargerFactures();
  }

  chargerPaiements(): void {
    this.paiementService.getPaiements().subscribe({
      next: (data) => {
        this.paiements = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Erreur chargement paiements', err);
      }
    });
  }

  chargerFactures(): void {

    this.factureService
      .getFactures()
      .subscribe({

        next: (data) => {
          this.factures = data;
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement factures',
            err
          );

          this.toastService.error(
            'Erreur lors du chargement des factures'
          );
        }
      });
  }

 chargerResumeFacture(
   factureId: number
 ): void {

   this.resumeFacture = null;

   if (!factureId) {
     return;
   }

   this.paiementService
     .getResumeFacture(factureId)
     .subscribe({

       next: (data) => {

         this.resumeFacture = data;

         this.cd.detectChanges();
       },

       error: (err) => {

         console.error(
           'Erreur chargement résumé facture',
           err
         );

         this.toastService.error(
           'Erreur lors du chargement du résumé de la facture'
         );
       }
     });
 }

  ouvrirFormulaire(): void {

    this.modeEdition = false;
    this.idPaiementEnCours = undefined;

    this.nouveauPaiement = {
      datePaiement: '',
      montantPaiement: 0,
      modePaiement: 'VIREMENT',
      referencePaiement: '',
      statut: 'EN_ATTENTE',
      facture: {
        id: 0
      },
      commande: null
    };

    this.resumeFacture = null;

    this.showForm = true;

  }

enregistrerPaiement(): void {

  if (
    !this.nouveauPaiement.referencePaiement.trim() ||
    !this.nouveauPaiement.datePaiement ||
    this.nouveauPaiement.montantPaiement <= 0 ||
    !this.nouveauPaiement.facture ||
    this.nouveauPaiement.facture.id === 0
  ) {

    this.toastService.warning(
      'Veuillez remplir correctement tous les champs'
    );

    return;
  }

  if (
    this.resumeFacture &&
    !this.modeEdition &&
    this.nouveauPaiement.statut === 'VALIDE' &&
    this.nouveauPaiement.montantPaiement >
      this.resumeFacture.resteAPayer
  ) {

    this.toastService.warning(
      `Le montant dépasse le reste à payer : ${
        this.resumeFacture.resteAPayer
      } DH`
    );

    return;
  }

  if (
    this.modeEdition &&
    this.idPaiementEnCours !== undefined
  ) {

    this.paiementService.updatePaiement(
      this.idPaiementEnCours,
      this.nouveauPaiement
    ).subscribe({
      next: () => {
        this.toastService.success(
          'Paiement modifié avec succès'
        );
        this.showForm = false;
        this.modeEdition = false;
        this.idPaiementEnCours = undefined;
        this.chargerPaiements();
      },
      error: (err) => {

        console.error(
          'Erreur modification paiement',
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
          || 'Erreur lors de l’enregistrement du paiement';

        this.toastService.error(message);
      }
    });

  } else {

    this.paiementService.savePaiement(this.nouveauPaiement).subscribe({
      next: () => {
        this.toastService.success(
          'Paiement enregistré avec succès'
        );
        this.showForm = false;
        this.chargerPaiements();
      },
      error: (err) => {

        console.error(
          'Erreur enregistrement paiement',
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
          || 'Erreur lors de l’enregistrement du paiement';

        this.toastService.error(message);
      }
    });

  }

}

modifierPaiement(paiement: any): void {

  this.modeEdition = true;
  this.idPaiementEnCours = paiement.id;
  this.showForm = true;

  this.nouveauPaiement = {
    datePaiement: paiement.datePaiement,
    montantPaiement: paiement.montantPaiement,
    modePaiement: paiement.modePaiement,
    referencePaiement: paiement.referencePaiement,
    statut: paiement.statut ?? 'EN_ATTENTE',

    facture: {
      id: Number(
        paiement.facture?.id ?? 0
      )
    },

    commande: {
      id: Number(
        paiement.commande?.id ?? 0
      )
    }
  };

  const factureId =
    this.nouveauPaiement.facture?.id ?? 0;

  if (factureId !== 0) {
    this.chargerResumeFacture(factureId);
  }

}

supprimerPaiement(id: number): void {

  this.confirmDialogService.open({

    title: 'Supprimer le paiement',

    message:
      'Voulez-vous vraiment supprimer ce paiement ? Cette action est irréversible.',

    confirmText: 'Supprimer',

    cancelText: 'Annuler',

    onConfirm: () => {

      this.paiementService
        .deletePaiement(id)
        .subscribe({

          next: () => {

            this.toastService.success(
              'Paiement supprimé avec succès'
            );

            this.chargerPaiements();
          },

          error: (err) => {

            console.error(
              'Erreur suppression paiement',
              err
            );

            this.toastService.error(
              'Erreur lors de la suppression du paiement'
            );
          }

        });
    }

  });
}

rechercherPaiements(): void {

  if (this.keyword.trim() === '') {
    this.chargerPaiements();
    return;
  }

  this.paiementService.searchPaiements(this.keyword).subscribe({

    next: (data) => {

      this.paiements = data;

      this.cd.detectChanges();

      if (data.length === 0) {

        this.toastService.info(
          'Aucun paiement trouvé'
        );

      }

    },

    error: (err) => {

      console.error(
        'Erreur recherche paiements',
        err
      );

      this.toastService.error(
        'Erreur lors de la recherche des paiements'
      );

    }

  });

}

reinitialiserRecherche(): void {
  this.keyword = '';
  this.chargerPaiements();
}

exporterExcel(): void {

  this.paiementService.exportExcel().subscribe({

    next: (blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = 'paiements.xlsx';

      a.click();

      window.URL.revokeObjectURL(url);

      this.toastService.success(
        'Export Excel téléchargé avec succès'
      );

    },

    error: (err) => {

      console.error(
        'Erreur export Excel Paiements',
        err
      );

      this.toastService.error(
        'Erreur lors de l’export Excel des paiements'
      );

    }

  });

}

exporterPdf(id: number): void {

  this.paiementService.exportPdf(id).subscribe({

    next: (blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = 'paiement_' + id + '.pdf';

      a.click();

      window.URL.revokeObjectURL(url);

      this.toastService.success(
        'PDF téléchargé avec succès'
      );

    },

    error: (err) => {

      console.error(
        'Erreur export PDF Paiement',
        err
      );

      this.toastService.error(
        'Erreur lors de l’export PDF du paiement'
      );

    }

  });

}

}
