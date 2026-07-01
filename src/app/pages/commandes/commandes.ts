import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Commande, CommandeService } from '../../services/commande';
import { MarcheService } from '../../services/marche';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [SidebarComponent, FormsModule],
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

  nouvelleCommande: Commande = {
    numeroCommande: '',
    dateCommande: '',
    montantCommande: 0,
    statut: 'EN_COURS',
    marche: {
      id: 0
    }
  };

  constructor(
    private commandeService: CommandeService,
    private marcheService: MarcheService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerCommandes();
    this.chargerMarches();
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
      }
    };

    this.showForm = true;
  }

enregistrerCommande(): void {

  if (this.modeEdition && this.idCommandeEnCours) {

    this.commandeService.updateCommande(
      this.idCommandeEnCours,
      this.nouvelleCommande
    ).subscribe({
      next: () => {
        alert('Commande modifiée ✅');
        this.showForm = false;
        this.modeEdition = false;
        this.idCommandeEnCours = undefined;
        this.chargerCommandes();
      },
      error: (err) => {
        console.log('Erreur modification commande', err);
        alert('Erreur lors de la modification');
      }
    });

  } else {

    this.commandeService.saveCommande(
      this.nouvelleCommande
    ).subscribe({
      next: () => {
        alert('Commande enregistrée ✅');
        this.showForm = false;
        this.chargerCommandes();
      },
      error: (err) => {
        console.log('Erreur enregistrement commande', err);
        alert('Erreur lors de l’enregistrement');
      }
    });

  }

}

modifierCommande(commande: any): void {

  this.modeEdition = true;
  this.idCommandeEnCours = commande.id;
  this.showForm = true;

  this.nouvelleCommande = {
    numeroCommande: commande.numeroCommande,
    dateCommande: commande.dateCommande,
    montantCommande: commande.montantCommande,
    statut: commande.statut,
    marche: {
      id: Number(commande.marche?.id)
    }
  };

}

supprimerCommande(id: number): void {

  if (confirm('Voulez-vous vraiment supprimer cette commande ?')) {

    this.commandeService.deleteCommande(id).subscribe({
      next: () => {
        alert('Commande supprimée ✅');
        this.chargerCommandes();
      },
      error: (err) => {
        console.log('Erreur suppression commande', err);
        alert('Erreur lors de la suppression');
      }
    });

  }
}

rechercherCommandes(): void {

  if (this.keyword.trim() === '') {
    this.chargerCommandes();
    return;
  }

  this.commandeService.searchCommandes(this.keyword).subscribe({
    next: (data) => {
      this.commandes = data;
      this.cd.detectChanges();
    },
    error: (err) => {
      console.log('Erreur recherche commandes', err);
    }
  });

}

reinitialiserRecherche(): void {
  this.keyword = '';
  this.chargerCommandes();
}

exporterExcel(): void {

  this.commandeService.exportExcel().subscribe({
    next: (blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'commandes.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);

    },
    error: (err) => {
      console.log('Erreur export Excel Commandes', err);
      alert('Erreur lors de l’export Excel');
    }
  });

}

exporterPdf(id: number): void {

  this.commandeService.exportPdf(id).subscribe({
    next: (blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'commande_' + id + '.pdf';
      a.click();

      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.log('Erreur export PDF Commande', err);
      alert('Erreur lors de l’export PDF');
    }
  });

}


}
