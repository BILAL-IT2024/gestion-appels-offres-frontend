import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Paiement, PaiementService } from '../../services/paiement';
import { CommandeService } from '../../services/commande';

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
    private cd: ChangeDetectorRef
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
        alert('Paiement modifié ✅');
        this.showForm = false;
        this.modeEdition = false;
        this.idPaiementEnCours = undefined;
        this.chargerPaiements();
      },
      error: (err) => {
        console.log('Erreur modification paiement', err);
        alert('Erreur lors de la modification');
      }
    });

  } else {

    this.paiementService.savePaiement(this.nouveauPaiement).subscribe({
      next: () => {
        alert('Paiement enregistré ✅');
        this.showForm = false;
        this.chargerPaiements();
      },
      error: (err) => {
        console.log('Erreur enregistrement paiement', err);
        alert('Erreur lors de l’enregistrement');
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
        alert('Paiement supprimé ✅');
        this.chargerPaiements();
      },
      error: (err) => {
        console.log('Erreur suppression paiement', err);
        alert('Erreur lors de la suppression');
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
    },
    error: (err) => {
      console.log('Erreur recherche paiements', err);
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

    },
    error: (err) => {
      console.log('Erreur export Excel Paiements', err);
      alert('Erreur lors de l’export Excel');
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

    },
    error: (err) => {
      console.log('Erreur export PDF Paiement', err);
      alert('Erreur lors de l’export PDF');
    }
  });

}

}
