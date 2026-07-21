import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Paiement, PaiementService } from '../../services/paiement';
import { CommandeService } from '../../services/commande';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [SidebarComponent, FormsModule],
  templateUrl: './paiements.html',
  styleUrl: './paiements.css',
})
export class Paiements implements OnInit {

  showForm = false;
  modeEdition = false;
  idPaiementEnCours?: number;

  paiements: any[] = [];
  keyword = '';
  commandes: any[] = [];

  nouveauPaiement: Paiement = {
    datePaiement: '',
    montantPaiement: 0,
    modePaiement: 'VIREMENT',
    referencePaiement: '',
    statut: 'EN_ATTENTE',
    commande: {
      id: 0
    }
  };

  constructor(
    private paiementService: PaiementService,
    private commandeService: CommandeService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.chargerPaiements();
    this.chargerCommandes();
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

  chargerCommandes(): void {
    this.commandeService.getCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
      },
      error: (err) => {
        console.log('Erreur chargement commandes', err);
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
      commande: {
        id: 0
      }
    };

    this.showForm = true;
  }

enregistrerPaiement(): void {

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
        console.log('Erreur modification paiement', err);
        this.toastService.error(
          'Erreur lors de la modification du paiement'
        );
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
        console.log('Erreur enregistrement paiement', err);
        this.toastService.error(
          'Erreur lors de l’enregistrement du paiement'
        );
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
    commande: {
      id: Number(paiement.commande?.id ?? 0)
    }
  };

}

supprimerPaiement(id: number): void {

  if (confirm('Voulez-vous vraiment supprimer ce paiement ?')) {

    this.paiementService.deletePaiement(id).subscribe({
      next: () => {
        this.toastService.success(
          'Paiement supprimé avec succès'
        );
        this.chargerPaiements();
      },
      error: (err) => {
        console.log('Erreur suppression paiement', err);
        this.toastService.error(
          'Erreur lors de la suppression du paiement'
        );
      }
    });

  }
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
