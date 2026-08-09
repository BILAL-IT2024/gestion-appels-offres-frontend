import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

import {
  OrdreService,
  OrdreServiceService
} from '../../services/ordre-service';

import { MarcheService } from '../../services/marche';

import { ToastService } from '../../services/toast';

import {
  ConfirmDialogService
} from '../../services/confirm-dialog';

@Component({
  selector: 'app-ordres-service',
  standalone: true,
  imports: [
    SidebarComponent,
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './ordres-service.html',
  styleUrl: './ordres-service.css',
})
export class OrdresService implements OnInit {

  showForm = false;
  modeEdition = false;

  idOrdreEnCours?: number;

  ordres: OrdreService[] = [];
  marches: any[] = [];

  keyword = '';

  nouvelOrdre: OrdreService =
    this.creerOrdreVide();

  constructor(
    private ordreServiceService: OrdreServiceService,
    private marcheService: MarcheService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.chargerOrdres();
    this.chargerMarches();
  }

  chargerOrdres(): void {

    this.ordreServiceService
      .getOrdres()
      .subscribe({

        next: (data) => {
          this.ordres = data;
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement ordres de service',
            err
          );

          this.toastService.error(
            'Erreur lors du chargement des ordres de service'
          );
        }
      });
  }

  chargerMarches(): void {

    this.marcheService
      .getMarches()
      .subscribe({

        next: (data) => {
          this.marches = data;
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement marchés',
            err
          );

          this.toastService.error(
            'Erreur lors du chargement des marchés'
          );
        }
      });
  }

  ouvrirFormulaire(): void {

    this.modeEdition = false;
    this.idOrdreEnCours = undefined;

    this.nouvelOrdre =
      this.creerOrdreVide();

    this.showForm = true;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  enregistrerOrdre(): void {

    if (
      !this.nouvelOrdre.numeroOrdre.trim() ||
      !this.nouvelOrdre.dateOrdre ||
      !this.nouvelOrdre.dateDebutExecution ||
      !this.nouvelOrdre.objet.trim() ||
      this.nouvelOrdre.marche.id === 0
    ) {
      this.toastService.warning(
        'Veuillez remplir correctement tous les champs'
      );
      return;
    }

    if (
      this.modeEdition &&
      this.idOrdreEnCours !== undefined
    ) {

      this.ordreServiceService
        .updateOrdre(
          this.idOrdreEnCours,
          this.nouvelOrdre
        )
        .subscribe({

          next: () => {

            this.toastService.success(
              'Ordre de service modifié avec succès'
            );

            this.showForm = false;
            this.modeEdition = false;
            this.idOrdreEnCours = undefined;

            this.chargerOrdres();
          },

          error: (err) => {

            console.error(
              'Erreur modification ordre de service',
              err
            );

            const message =
              err?.error?.message
              || 'Erreur lors de la modification de l’ordre de service';

            this.toastService.error(message);
          }
        });

      return;
    }

    this.ordreServiceService
      .saveOrdre(this.nouvelOrdre)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Ordre de service enregistré avec succès'
          );

          this.showForm = false;

          this.chargerOrdres();
        },

        error: (err) => {

          console.error(
            'Erreur enregistrement ordre de service',
            err
          );

          const message =
            err?.error?.message
            || 'Erreur lors de l’enregistrement de l’ordre de service';

          this.toastService.error(message);
        }
      });
  }

  modifierOrdre(
    ordre: OrdreService
  ): void {

    this.modeEdition = true;
    this.idOrdreEnCours = ordre.id;
    this.showForm = true;

    this.nouvelOrdre = {
      numeroOrdre: ordre.numeroOrdre,
      dateOrdre: ordre.dateOrdre,
      dateDebutExecution:
        ordre.dateDebutExecution,
      objet: ordre.objet,
      statut: ordre.statut,
      marche: {
        id: Number(
          ordre.marche?.id ?? 0
        )
      }
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  supprimerOrdre(
    id: number
  ): void {

    this.confirmDialogService.open({

      title: 'Supprimer l’ordre de service',

      message:
        'Voulez-vous vraiment supprimer cet ordre de service ? Cette action est irréversible.',

      confirmText: 'Supprimer',

      cancelText: 'Annuler',

      onConfirm: () => {

        this.ordreServiceService
          .deleteOrdre(id)
          .subscribe({

            next: () => {

              this.toastService.success(
                'Ordre de service supprimé avec succès'
              );

              this.chargerOrdres();
            },

            error: (err) => {

              console.error(
                'Erreur suppression ordre de service',
                err
              );

              const message =
                err?.error?.message
                || 'Erreur lors de la suppression de l’ordre de service';

              this.toastService.error(message);
            }
          });
      }
    });
  }

  rechercherOrdres(): void {

    const recherche =
      this.keyword.trim();

    if (!recherche) {
      this.chargerOrdres();
      return;
    }

    this.ordreServiceService
      .searchOrdres(recherche)
      .subscribe({

        next: (data) => {

          this.ordres = data;
          this.cd.detectChanges();

          if (data.length === 0) {
            this.toastService.info(
              'Aucun ordre de service trouvé'
            );
          }
        },

        error: (err) => {

          console.error(
            'Erreur recherche ordres de service',
            err
          );

          this.toastService.error(
            'Erreur lors de la recherche des ordres de service'
          );
        }
      });
  }

  reinitialiserRecherche(): void {
    this.keyword = '';
    this.chargerOrdres();
  }

  exporterExcel(): void {

    this.ordreServiceService
      .exportExcel()
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const lien =
            document.createElement('a');

          lien.href = url;
          lien.download =
            'ordres_service.xlsx';

          lien.click();

          window.URL.revokeObjectURL(url);

          this.toastService.success(
            'Export Excel téléchargé avec succès'
          );
        },

        error: (err) => {

          console.error(
            'Erreur export Excel Ordres de service',
            err
          );

          this.toastService.error(
            'Erreur lors de l’export Excel des ordres de service'
          );
        }
      });
  }

  exporterPdf(
    id: number
  ): void {

    this.ordreServiceService
      .exportPdf(id)
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const lien =
            document.createElement('a');

          lien.href = url;
          lien.download =
            `ordre_service_${id}.pdf`;

          lien.click();

          window.URL.revokeObjectURL(url);

          this.toastService.success(
            'PDF téléchargé avec succès'
          );
        },

        error: (err) => {

          console.error(
            'Erreur export PDF Ordre de service',
            err
          );

          this.toastService.error(
            'Erreur lors de l’export PDF de l’ordre de service'
          );
        }
      });
  }

  private creerOrdreVide(): OrdreService {

    return {
      numeroOrdre: '',
      dateOrdre: '',
      dateDebutExecution: '',
      objet: '',
      statut: 'EMIS',
      marche: {
        id: 0
      }
    };
  }
}
