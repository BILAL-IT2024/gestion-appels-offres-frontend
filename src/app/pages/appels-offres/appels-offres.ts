import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Client, ClientService } from '../../services/client';
import { AppelOffresService } from '../../services/appel-offres';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-appels-offres',
  standalone: true,
  imports: [SidebarComponent, FormsModule],
  templateUrl: './appels-offres.html',
  styleUrl: './appels-offres.css',
})
export class AppelsOffresComponent implements OnInit {

  showForm = false;
  modeEdition = false;
  idAppelOffreEnCours?: number;

  clients: Client[] = [];
  appelsOffres: any[] = [];
  keyword = '';

  nouvelAppelOffre = {
    reference: '',
    objet: '',
    datePublication: '',
    dateLimite: '',
    montantEstime: 0,
    statut: 'EN_COURS',
    client: {
      id: 0
    }
  };

  constructor(
    private clientService: ClientService,
    private appelOffresService: AppelOffresService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.chargerClients();
    this.chargerAppelsOffres();
  }

  ouvrirFormulaire(): void {

    this.modeEdition = false;
    this.idAppelOffreEnCours = undefined;

    this.nouvelAppelOffre = {
      reference: '',
      objet: '',
      datePublication: '',
      dateLimite: '',
      montantEstime: 0,
      statut: 'EN_COURS',
      client: {
        id: 0
      }
    };

    this.showForm = true;
  }

  chargerClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        console.log('Erreur chargement clients', err);
      }
    });
  }

  enregistrerAppelOffre(): void {

    if (
      this.modeEdition &&
      this.idAppelOffreEnCours !== undefined
    ) {

      this.appelOffresService
        .updateAppelOffre(
          this.idAppelOffreEnCours,
          this.nouvelAppelOffre
        )
        .subscribe({

          next: () => {

            this.toastService.success(
              'Appel d’offre modifié avec succès'
            );

            this.showForm = false;
            this.modeEdition = false;
            this.idAppelOffreEnCours = undefined;

            this.chargerAppelsOffres();
          },

          error: (err) => {

            console.error(
              'Erreur modification appel d’offre',
              err
            );

            this.toastService.error(
              'Erreur lors de la modification de l’appel d’offre'
            );
          }
        });

      return;
    }

    this.appelOffresService
      .saveAppelOffre(this.nouvelAppelOffre)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Appel d’offre enregistré avec succès'
          );

          this.showForm = false;

          this.chargerAppelsOffres();
        },

        error: (err) => {

          console.error(
            'Erreur enregistrement appel d’offre',
            err
          );

          this.toastService.error(
            'Erreur lors de l’enregistrement de l’appel d’offre'
          );
        }
      });
  }

  chargerAppelsOffres(): void {

    this.appelOffresService.getAppelsOffres().subscribe({
      next: (data) => {
        console.log('AO reçus = ', data);
        this.appelsOffres = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Erreur chargement AO = ', err);
      }
    });

  }

  supprimerAppelOffre(id: number): void {

    const confirmation = confirm(
      'Voulez-vous vraiment supprimer cet appel d’offre ?'
    );

    if (!confirmation) {
      return;
    }

    this.appelOffresService
      .deleteAppelOffre(id)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Appel d’offre supprimé avec succès'
          );

          this.chargerAppelsOffres();
        },

        error: (err) => {

          console.error(
            'Erreur suppression appel d’offre',
            err
          );

          this.toastService.error(
            'Erreur lors de la suppression de l’appel d’offre'
          );
        }
      });
  }

  modifierAppelOffre(ao: any): void {

    this.modeEdition = true;
    this.idAppelOffreEnCours = ao.id;
    this.showForm = true;

    this.nouvelAppelOffre = {
      reference: ao.reference,
      objet: ao.objet,
      datePublication: ao.datePublication,
      dateLimite: ao.dateLimite,
      montantEstime: ao.montantEstime,
      statut: ao.statut,
      client: {
        id: Number(
          ao.client?.id ??
          ao.clientId ??
          0
        )
      }
    };

  }

  rechercherAppelsOffres(): void {

    const recherche = this.keyword.trim();

    if (!recherche) {
      this.chargerAppelsOffres();
      return;
    }

    this.appelOffresService
      .searchAppelsOffres(recherche)
      .subscribe({

        next: (data) => {

          this.appelsOffres = data;

          this.cd.detectChanges();

          if (data.length === 0) {
            this.toastService.info(
              'Aucun appel d’offre trouvé'
            );
          }
        },

        error: (err) => {

          console.error(
            'Erreur recherche appels d’offres',
            err
          );

          this.toastService.error(
            'Erreur lors de la recherche des appels d’offres'
          );
        }
      });
  }

  reinitialiserRecherche(): void {
    this.keyword = '';
    this.chargerAppelsOffres();
  }

exporterExcel(): void {

  this.appelOffresService
    .exportExcel()
    .subscribe({

      next: (blob) => {

        const url =
          window.URL.createObjectURL(blob);

        const lien =
          document.createElement('a');

        lien.href = url;
        lien.download = 'appels_offres.xlsx';

        lien.click();

        window.URL.revokeObjectURL(url);

        this.toastService.success(
          'Export Excel téléchargé avec succès'
        );
      },

      error: (err) => {

        console.error(
          'Erreur export Excel appels d’offres',
          err
        );

        this.toastService.error(
          'Erreur lors de l’export Excel des appels d’offres'
        );
      }
    });
}

exporterPdf(id: number): void {

  this.appelOffresService
    .exportPdf(id)
    .subscribe({

      next: (blob) => {

        const url =
          window.URL.createObjectURL(blob);

        const lien =
          document.createElement('a');

        lien.href = url;
        lien.download = `appel_offre_${id}.pdf`;

        lien.click();

        window.URL.revokeObjectURL(url);

        this.toastService.success(
          'PDF téléchargé avec succès'
        );
      },

      error: (err) => {

        console.error(
          'Erreur export PDF appel d’offre',
          err
        );

        this.toastService.error(
          'Erreur lors de l’export PDF de l’appel d’offre'
        );
      }
    });
}

}
