import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Commande, CommandeService } from '../../services/commande';
import { MarcheService } from '../../services/marche';
import { ToastService } from '../../services/toast';

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
    private cd: ChangeDetectorRef,
    private toastService: ToastService
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

          this.toastService.error(
            'Erreur lors de la modification de la commande'
          );
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

        this.toastService.error(
          'Erreur lors de l’enregistrement de la commande'
        );
      }
    });
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
      id: Number(commande.marche?.id ?? 0)
    }
  };

}

supprimerCommande(id: number): void {

  const confirmation = confirm(
    'Voulez-vous vraiment supprimer cette commande ?'
  );

  if (!confirmation) {
    return;
  }

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
