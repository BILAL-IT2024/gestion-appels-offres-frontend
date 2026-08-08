import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

import {
  Offre,
  OffreService
} from '../../services/offre';

import {
  AppelOffresService
} from '../../services/appel-offres';

import {
  ConsultationService
} from '../../services/consultation';

import { ToastService } from '../../services/toast';

import {
  ConfirmDialogService
} from '../../services/confirm-dialog';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-offres',
  standalone: true,
  imports: [
    SidebarComponent,
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './offres.html',
  styleUrl: './offres.css',
})
export class Offres implements OnInit {

  showForm = false;
  modeEdition = false;

  idOffreEnCours?: number;

  offres: Offre[] = [];
  appelsOffres: any[] = [];
  consultations: any[] = [];

  keyword = '';

  typeSource: 'AO' | 'CONSULTATION' = 'AO';

  nouvelleOffre: Offre =
    this.creerOffreVide();

  constructor(
    private offreService: OffreService,
    private appelOffresService: AppelOffresService,
    private consultationService: ConsultationService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.chargerOffres();
    this.chargerAppelsOffres();
    this.chargerConsultations();
  }

  chargerOffres(): void {

    this.offreService
      .getOffres()
      .subscribe({

        next: (data) => {
          this.offres = data;
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement offres',
            err
          );

          this.toastService.error(
            'Erreur lors du chargement des offres'
          );
        }
      });
  }

  chargerAppelsOffres(): void {

    this.appelOffresService
      .getAppelsOffres()
      .subscribe({

        next: (data) => {
          this.appelsOffres = data;
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement appels d’offres',
            err
          );
        }
      });
  }

  chargerConsultations(): void {

    this.consultationService
      .getConsultations()
      .subscribe({

        next: (data) => {
          this.consultations = data;
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement consultations',
            err
          );
        }
      });
  }

  ouvrirFormulaire(): void {

    this.modeEdition = false;
    this.idOffreEnCours = undefined;

    this.typeSource = 'AO';

    this.nouvelleOffre =
      this.creerOffreVide();

    this.showForm = true;
  }

  changerTypeSource(): void {

    if (this.typeSource === 'AO') {

      this.nouvelleOffre.consultation = null;

      if (!this.nouvelleOffre.appelDoffres) {
        this.nouvelleOffre.appelDoffres = {
          id: 0
        };
      }

    } else {

      this.nouvelleOffre.appelDoffres = null;

      if (!this.nouvelleOffre.consultation) {
        this.nouvelleOffre.consultation = {
          id: 0
        };
      }
    }
  }

  enregistrerOffre(): void {

    if (
      !this.nouvelleOffre.reference.trim() ||
      !this.nouvelleOffre.dateOffre ||
      this.nouvelleOffre.montantOffre <= 0
    ) {
      this.toastService.warning(
        'Veuillez remplir correctement tous les champs'
      );
      return;
    }

    if (
      this.typeSource === 'AO' &&
      (
        !this.nouvelleOffre.appelDoffres ||
        this.nouvelleOffre.appelDoffres.id === 0
      )
    ) {
      this.toastService.warning(
        'Veuillez sélectionner un appel d’offres'
      );
      return;
    }

    if (
      this.typeSource === 'CONSULTATION' &&
      (
        !this.nouvelleOffre.consultation ||
        this.nouvelleOffre.consultation.id === 0
      )
    ) {
      this.toastService.warning(
        'Veuillez sélectionner une consultation'
      );
      return;
    }

    if (this.typeSource === 'AO') {
      this.nouvelleOffre.consultation = null;
    } else {
      this.nouvelleOffre.appelDoffres = null;
    }

    if (
      this.modeEdition &&
      this.idOffreEnCours !== undefined
    ) {

      this.offreService
        .updateOffre(
          this.idOffreEnCours,
          this.nouvelleOffre
        )
        .subscribe({

          next: () => {

            this.toastService.success(
              'Offre modifiée avec succès'
            );

            this.showForm = false;
            this.modeEdition = false;
            this.idOffreEnCours = undefined;

            this.chargerOffres();
          },

          error: (err) => {

            console.error(
              'Erreur modification offre',
              err
            );

            const message =
              err?.error?.message
              || 'Erreur lors de la modification de l’offre';

            this.toastService.error(message);
          }
        });

      return;
    }

    this.offreService
      .saveOffre(
        this.nouvelleOffre
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Offre enregistrée avec succès'
          );

          this.showForm = false;

          this.chargerOffres();
        },

        error: (err) => {

          console.error(
            'Erreur enregistrement offre',
            err
          );

          const message =
            err?.error?.message
            || 'Erreur lors de l’enregistrement de l’offre';

          this.toastService.error(message);
        }
      });
  }

  modifierOffre(
    offre: Offre
  ): void {

    this.modeEdition = true;
    this.idOffreEnCours = offre.id;
    this.showForm = true;

    if (offre.appelDoffres) {
      this.typeSource = 'AO';
    } else {
      this.typeSource = 'CONSULTATION';
    }

    this.nouvelleOffre = {
      reference: offre.reference,
      dateOffre: offre.dateOffre,
      montantOffre: offre.montantOffre,
      statut: offre.statut,
      das: offre.das,

      appelDoffres:
        offre.appelDoffres
          ? {
              id: Number(
                offre.appelDoffres.id
              )
            }
          : null,

      consultation:
        offre.consultation
          ? {
              id: Number(
                offre.consultation.id
              )
            }
          : null
    };
  }

  supprimerOffre(
    id: number
  ): void {

    this.confirmDialogService.open({

      title: 'Supprimer l’offre',

      message:
        'Voulez-vous vraiment supprimer cette offre ? Cette action est irréversible.',

      confirmText: 'Supprimer',

      cancelText: 'Annuler',

      onConfirm: () => {

        this.offreService
          .deleteOffre(id)
          .subscribe({

            next: () => {

              this.toastService.success(
                'Offre supprimée avec succès'
              );

              this.chargerOffres();
            },

            error: (err) => {

              console.error(
                'Erreur suppression offre',
                err
              );

              const message =
                err?.error?.message
                || 'Erreur lors de la suppression de l’offre';

              this.toastService.error(message);
            }
          });
      }
    });
  }

  rechercherOffres(): void {

    const recherche =
      this.keyword.trim();

    if (!recherche) {
      this.chargerOffres();
      return;
    }

    this.offreService
      .searchOffres(recherche)
      .subscribe({

        next: (data) => {

          this.offres = data;

          this.cd.detectChanges();

          if (data.length === 0) {
            this.toastService.info(
              'Aucune offre trouvée'
            );
          }
        },

        error: (err) => {

          console.error(
            'Erreur recherche offres',
            err
          );

          this.toastService.error(
            'Erreur lors de la recherche des offres'
          );
        }
      });
  }

  reinitialiserRecherche(): void {
    this.keyword = '';
    this.chargerOffres();
  }

  exporterExcel(): void {

    this.offreService
      .exportExcel()
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const lien =
            document.createElement('a');

          lien.href = url;
          lien.download = 'offres.xlsx';

          lien.click();

          window.URL.revokeObjectURL(url);

          this.toastService.success(
            'Export Excel téléchargé avec succès'
          );
        },

        error: (err) => {

          console.error(
            'Erreur export Excel Offres',
            err
          );

          this.toastService.error(
            'Erreur lors de l’export Excel des offres'
          );
        }
      });
  }


  exporterPdf(id: number): void {

    this.offreService
      .exportPdf(id)
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const lien =
            document.createElement('a');

          lien.href = url;
          lien.download = `offre_${id}.pdf`;

          lien.click();

          window.URL.revokeObjectURL(url);

          this.toastService.success(
            'PDF téléchargé avec succès'
          );
        },

        error: (err) => {

          console.error(
            'Erreur export PDF Offre',
            err
          );

          this.toastService.error(
            'Erreur lors de l’export PDF de l’offre'
          );
        }
      });
  }

  private creerOffreVide(): Offre {

    return {
      reference: '',
      dateOffre: '',
      montantOffre: 0,
      statut: 'EN_PREPARATION',
      das: undefined,

      appelDoffres: {
        id: 0
      },

      consultation: null
    };
  }
}
