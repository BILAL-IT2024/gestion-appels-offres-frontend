import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Marche, MarcheService } from '../../services/marche';
import { AppelOffresService } from '../../services/appel-offres';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-marches',
  standalone: true,
  imports: [SidebarComponent, FormsModule],
  templateUrl: './marches.html',
  styleUrl: './marches.css',
})
export class Marches implements OnInit {

  showForm = false;
  modeEdition = false;
  idMarcheEnCours?: number;

  marches: any[] = [];
  keyword = '';
  appelsOffres: any[] = [];

  nouveauMarche: Marche = {
    numeroMarche: '',
    dateDebut: '',
    dateFin: '',
    montantMarche: 0,
    tauxExecution: 0,
    statut: 'EN_COURS',
    appelDoffres: {
      id: 0
    }
  };

  constructor(
    private marcheService: MarcheService,
    private appelOffresService: AppelOffresService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.chargerMarches();
    this.chargerAppelsOffres();
  }

  chargerMarches(): void {
    this.marcheService.getMarches().subscribe({
      next: (data) => {
        this.marches = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Erreur chargement marchés', err);
      }
    });
  }

  chargerAppelsOffres(): void {
    this.appelOffresService.getAppelsOffres().subscribe({
      next: (data) => {
        this.appelsOffres = data;
      },
      error: (err) => {
        console.log('Erreur chargement AO', err);
      }
    });
  }

ouvrirFormulaire(): void {

  this.modeEdition = false;
  this.idMarcheEnCours = undefined;

  this.nouveauMarche = {
    numeroMarche: '',
    dateDebut: '',
    dateFin: '',
    montantMarche: 0,
    tauxExecution: 0,
    statut: 'EN_COURS',
    appelDoffres: {
      id: 0
    }
  };

  this.showForm = true;
}

enregistrerMarche(): void {

  if (
    this.modeEdition &&
    this.idMarcheEnCours !== undefined
  ) {

    this.marcheService
      .updateMarche(
        this.idMarcheEnCours,
        this.nouveauMarche
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Marché modifié avec succès'
          );

          this.showForm = false;
          this.modeEdition = false;
          this.idMarcheEnCours = undefined;

          this.chargerMarches();
        },

        error: (err) => {

          console.error(
            'Erreur modification marché',
            err
          );

          this.toastService.error(
            'Erreur lors de la modification du marché'
          );
        }
      });

    return;
  }

  this.marcheService
    .saveMarche(this.nouveauMarche)
    .subscribe({

      next: () => {

        this.toastService.success(
          'Marché enregistré avec succès'
        );

        this.showForm = false;

        this.chargerMarches();
      },

      error: (err) => {

        console.error(
          'Erreur enregistrement marché',
          err
        );

        this.toastService.error(
          'Erreur lors de l’enregistrement du marché'
        );
      }
    });
}

supprimerMarche(id: number): void {

  const confirmation = confirm(
    'Voulez-vous vraiment supprimer ce marché ?'
  );

  if (!confirmation) {
    return;
  }

  this.marcheService
    .deleteMarche(id)
    .subscribe({

      next: () => {

        this.toastService.success(
          'Marché supprimé avec succès'
        );

        this.chargerMarches();
      },

      error: (err) => {

        console.error(
          'Erreur suppression marché',
          err
        );

        this.toastService.error(
          'Erreur lors de la suppression du marché'
        );
      }
    });
}

modifierMarche(marche: any): void {

  this.modeEdition = true;
  this.idMarcheEnCours = marche.id;
  this.showForm = true;

  this.nouveauMarche = {
    numeroMarche: marche.numeroMarche,
    dateDebut: marche.dateDebut,
    dateFin: marche.dateFin,
    montantMarche: marche.montantMarche,
    tauxExecution: marche.tauxExecution,
    statut: marche.statut,
    appelDoffres: {
      id: Number(marche.appelDoffres?.id ?? 0)
    }
  };

}

rechercherMarches(): void {

  const recherche = this.keyword.trim();

  if (!recherche) {
    this.chargerMarches();
    return;
  }

  this.marcheService
    .searchMarches(recherche)
    .subscribe({

      next: (data) => {

        this.marches = data;

        this.cd.detectChanges();

        if (data.length === 0) {
          this.toastService.info(
            'Aucun marché trouvé'
          );
        }
      },

      error: (err) => {

        console.error(
          'Erreur recherche marchés',
          err
        );

        this.toastService.error(
          'Erreur lors de la recherche des marchés'
        );
      }
    });
}

reinitialiserRecherche(): void {
  this.keyword = '';
  this.chargerMarches();
}

exporterExcel(): void {

  this.marcheService
    .exportExcel()
    .subscribe({

      next: (blob) => {

        const url =
          window.URL.createObjectURL(blob);

        const lien =
          document.createElement('a');

        lien.href = url;
        lien.download = 'marches.xlsx';

        lien.click();

        window.URL.revokeObjectURL(url);

        this.toastService.success(
          'Export Excel téléchargé avec succès'
        );
      },

      error: (err) => {

        console.error(
          'Erreur export Excel Marchés',
          err
        );

        this.toastService.error(
          'Erreur lors de l’export Excel des marchés'
        );
      }
    });
}

exporterPdf(id: number): void {

  this.marcheService
    .exportPdf(id)
    .subscribe({

      next: (blob) => {

        const url =
          window.URL.createObjectURL(blob);

        const lien =
          document.createElement('a');

        lien.href = url;
        lien.download = `marche_${id}.pdf`;

        lien.click();

        window.URL.revokeObjectURL(url);

        this.toastService.success(
          'PDF téléchargé avec succès'
        );
      },

      error: (err) => {

        console.error(
          'Erreur export PDF Marché',
          err
        );

        this.toastService.error(
          'Erreur lors de l’export PDF du marché'
        );
      }
    });
}

}
