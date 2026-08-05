import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { DecimalPipe } from '@angular/common';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

import {
  Consultation,
  ConsultationService
} from '../../services/consultation';

import {
  Client,
  ClientService
} from '../../services/client';

import { ToastService } from '../../services/toast';

import {
  ConfirmDialogService
} from '../../services/confirm-dialog';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [
    SidebarComponent,
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './consultations.html',
  styleUrl: './consultations.css'
})

export class Consultations implements OnInit {

  showForm = false;
  modeEdition = false;

  idConsultationEnCours?: number;

  consultations: any[] = [];
  clients: Client[] = [];

  keyword = '';

  nouvelleConsultation: Consultation =
    this.creerConsultationVide();

  constructor(
    private consultationService: ConsultationService,
    private clientService: ClientService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.chargerConsultations();
    this.chargerClients();
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

  chargerClients(): void {

    this.clientService
      .getClients()
      .subscribe({

        next: (data) => {
          this.clients = data;
          this.cd.detectChanges();
        },

        error: (err) => {
          console.error(
            'Erreur chargement clients',
            err
          );
        }

      });
  }

  ouvrirFormulaire(): void {

    this.modeEdition = false;
    this.idConsultationEnCours = undefined;

    this.nouvelleConsultation =
      this.creerConsultationVide();

    this.showForm = true;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

  enregistrerConsultation(): void {

    if (
      !this.nouvelleConsultation.reference.trim() ||
      !this.nouvelleConsultation.objet.trim() ||
      !this.nouvelleConsultation.dateReception ||
      this.nouvelleConsultation.montantPropose <= 0 ||
      !this.nouvelleConsultation.das ||
      this.nouvelleConsultation.client.id === 0
    ) {
      this.toastService.warning(
        'Veuillez remplir correctement tous les champs'
      );
      return;
    }

    if (
      this.modeEdition &&
      this.idConsultationEnCours !== undefined
    ) {

      this.consultationService
        .updateConsultation(
          this.idConsultationEnCours,
          this.nouvelleConsultation
        )
        .subscribe({

          next: () => {

            this.toastService.success(
              'Consultation modifiée avec succès'
            );

            this.showForm = false;
            this.modeEdition = false;
            this.idConsultationEnCours = undefined;

            this.chargerConsultations();
          },

          error: (err) => {

            console.error(
              'Erreur modification consultation',
              err
            );

            this.toastService.error(
              'Erreur lors de la modification de la consultation'
            );
          }
        });

      return;
    }

    this.consultationService
      .saveConsultation(
        this.nouvelleConsultation
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Consultation enregistrée avec succès'
          );

          this.showForm = false;

          this.chargerConsultations();
        },

        error: (err) => {

          console.error(
            'Erreur enregistrement consultation',
            err
          );

          this.toastService.error(
            'Erreur lors de l’enregistrement de la consultation'
          );
        }
      });
  }

  modifierConsultation(
    consultation: any
  ): void {

    this.modeEdition = true;

    this.idConsultationEnCours =
      consultation.id;

    this.nouvelleConsultation = {
      reference: consultation.reference,
      objet: consultation.objet,
      dateReception:
        consultation.dateReception,
      montantPropose:
        consultation.montantPropose,
      statut: consultation.statut,
       das: consultation.das ?? '',
      client: {
        id: Number(
          consultation.client?.id ?? 0
        )
      }
    };

    this.showForm = true;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  supprimerConsultation(id: number): void {

    this.confirmDialogService.open({

      title: 'Supprimer la consultation',

      message:
        'Voulez-vous vraiment supprimer cette consultation ? Cette action est irréversible.',

      confirmText: 'Supprimer',

      cancelText: 'Annuler',

      onConfirm: () => {

        this.consultationService
          .deleteConsultation(id)
          .subscribe({

            next: () => {

              this.toastService.success(
                'Consultation supprimée avec succès'
              );

              this.chargerConsultations();
            },

            error: (err) => {

              console.error(
                'Erreur suppression consultation',
                err
              );

              this.toastService.error(
                'Erreur lors de la suppression de la consultation'
              );
            }
          });
      }
    });
  }

  rechercherConsultations(): void {

    const recherche = this.keyword.trim();

    if (!recherche) {
      this.chargerConsultations();
      return;
    }

    this.consultationService
      .searchConsultations(recherche)
      .subscribe({

        next: (data) => {

          this.consultations = data;

          this.cd.detectChanges();

          if (data.length === 0) {
            this.toastService.info(
              'Aucune consultation trouvée'
            );
          }
        },

        error: (err) => {

          console.error(
            'Erreur recherche consultations',
            err
          );

          this.toastService.error(
            'Erreur lors de la recherche des consultations'
          );
        }
      });
  }

  reinitialiserRecherche(): void {

    this.keyword = '';

    this.chargerConsultations();
  }

  exporterExcel(): void {

    this.consultationService
      .exportExcel()
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const lien =
            document.createElement('a');

          lien.href = url;
          lien.download = 'consultations.xlsx';

          lien.click();

          window.URL.revokeObjectURL(url);

          this.toastService.success(
            'Export Excel téléchargé avec succès'
          );
        },

        error: (err) => {

          console.error(
            'Erreur export Excel Consultations',
            err
          );

          this.toastService.error(
            'Erreur lors de l’export Excel des consultations'
          );
        }
      });
  }

  exporterPdf(id: number): void {

    this.consultationService
      .exportPdf(id)
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const lien =
            document.createElement('a');

          lien.href = url;
          lien.download = `consultation_${id}.pdf`;

          lien.click();

          window.URL.revokeObjectURL(url);

          this.toastService.success(
            'PDF téléchargé avec succès'
          );
        },

        error: (err) => {

          console.error(
            'Erreur export PDF Consultation',
            err
          );

          this.toastService.error(
            'Erreur lors de l’export PDF de la consultation'
          );
        }
      });
  }

private creerConsultationVide(): Consultation {

  return {
    reference: '',
    objet: '',
    dateReception: '',
    montantPropose: 0,
    statut: 'EN_COURS',
    das: '',
    client: {
      id: 0
    }
  };

}

}
