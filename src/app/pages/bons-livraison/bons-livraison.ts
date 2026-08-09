import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

import {
  BonLivraison,
  BonLivraisonService
} from '../../services/bon-livraison';

import {
  CommandeService
} from '../../services/commande';

import { ToastService } from '../../services/toast';

import {
  ConfirmDialogService
} from '../../services/confirm-dialog';

@Component({
  selector: 'app-bons-livraison',
  standalone: true,
  imports: [
    SidebarComponent,
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './bons-livraison.html',
  styleUrl: './bons-livraison.css',
})
export class BonsLivraison implements OnInit {

  showForm = false;
  modeEdition = false;

  idBonEnCours?: number;

  bonsLivraison: BonLivraison[] = [];
  commandes: any[] = [];

  keyword = '';

  nouveauBon: BonLivraison =
    this.creerBonVide();

  constructor(
    private bonLivraisonService: BonLivraisonService,
    private commandeService: CommandeService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.chargerBonsLivraison();
    this.chargerCommandes();
  }

  chargerBonsLivraison(): void {

    this.bonLivraisonService
      .getBonsLivraison()
      .subscribe({

        next: (data) => {
          this.bonsLivraison = data;
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement bons de livraison',
            err
          );

          this.toastService.error(
            'Erreur lors du chargement des bons de livraison'
          );
        }
      });
  }

  chargerCommandes(): void {

    this.commandeService
      .getCommandes()
      .subscribe({

        next: (data) => {
          this.commandes = data;
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement commandes',
            err
          );

          this.toastService.error(
            'Erreur lors du chargement des commandes'
          );
        }
      });
  }

  ouvrirFormulaire(): void {

    this.modeEdition = false;
    this.idBonEnCours = undefined;

    this.nouveauBon =
      this.creerBonVide();

    this.showForm = true;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  enregistrerBon(): void {

    if (
      !this.nouveauBon.numeroBon.trim() ||
      !this.nouveauBon.dateLivraison ||
      !this.nouveauBon.objet.trim() ||
      this.nouveauBon.commande.id === 0
    ) {
      this.toastService.warning(
        'Veuillez remplir correctement tous les champs'
      );
      return;
    }

    if (
      this.modeEdition &&
      this.idBonEnCours !== undefined
    ) {

      this.bonLivraisonService
        .updateBonLivraison(
          this.idBonEnCours,
          this.nouveauBon
        )
        .subscribe({

          next: () => {

            this.toastService.success(
              'Bon de livraison modifié avec succès'
            );

            this.showForm = false;
            this.modeEdition = false;
            this.idBonEnCours = undefined;

            this.chargerBonsLivraison();
          },

          error: (err) => {

            console.error(
              'Erreur modification bon de livraison',
              err
            );

            const message =
              err?.error?.message
              || 'Erreur lors de la modification du bon de livraison';

            this.toastService.error(message);
          }
        });

      return;
    }

    this.bonLivraisonService
      .saveBonLivraison(
        this.nouveauBon
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Bon de livraison enregistré avec succès'
          );

          this.showForm = false;

          this.chargerBonsLivraison();
        },

        error: (err) => {

          console.error(
            'Erreur enregistrement bon de livraison',
            err
          );

          const message =
            err?.error?.message
            || 'Erreur lors de l’enregistrement du bon de livraison';

          this.toastService.error(message);
        }
      });
  }

  modifierBon(
    bon: BonLivraison
  ): void {

    this.modeEdition = true;
    this.idBonEnCours = bon.id;
    this.showForm = true;

    this.nouveauBon = {
      numeroBon: bon.numeroBon,
      dateLivraison: bon.dateLivraison,
      objet: bon.objet,
      statut: bon.statut,
      commande: {
        id: Number(
          bon.commande?.id ?? 0
        )
      }
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  supprimerBon(
    id: number
  ): void {

    this.confirmDialogService.open({

      title: 'Supprimer le bon de livraison',

      message:
        'Voulez-vous vraiment supprimer ce bon de livraison ? Cette action est irréversible.',

      confirmText: 'Supprimer',

      cancelText: 'Annuler',

      onConfirm: () => {

        this.bonLivraisonService
          .deleteBonLivraison(id)
          .subscribe({

            next: () => {

              this.toastService.success(
                'Bon de livraison supprimé avec succès'
              );

              this.chargerBonsLivraison();
            },

            error: (err) => {

              console.error(
                'Erreur suppression bon de livraison',
                err
              );

              const message =
                err?.error?.message
                || 'Erreur lors de la suppression du bon de livraison';

              this.toastService.error(message);
            }
          });
      }
    });
  }

  rechercherBons(): void {

    const recherche =
      this.keyword.trim();

    if (!recherche) {
      this.chargerBonsLivraison();
      return;
    }

    this.bonLivraisonService
      .searchBonsLivraison(recherche)
      .subscribe({

        next: (data) => {

          this.bonsLivraison = data;
          this.cd.detectChanges();

          if (data.length === 0) {
            this.toastService.info(
              'Aucun bon de livraison trouvé'
            );
          }
        },

        error: (err) => {

          console.error(
            'Erreur recherche bons de livraison',
            err
          );

          this.toastService.error(
            'Erreur lors de la recherche des bons de livraison'
          );
        }
      });
  }

  reinitialiserRecherche(): void {
    this.keyword = '';
    this.chargerBonsLivraison();
  }

  exporterExcel(): void {

    this.bonLivraisonService
      .exportExcel()
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const lien =
            document.createElement('a');

          lien.href = url;
          lien.download =
            'bons_livraison.xlsx';

          lien.click();

          window.URL.revokeObjectURL(url);

          this.toastService.success(
            'Export Excel téléchargé avec succès'
          );
        },

        error: (err) => {

          console.error(
            'Erreur export Excel Bons de livraison',
            err
          );

          this.toastService.error(
            'Erreur lors de l’export Excel des bons de livraison'
          );
        }
      });
  }

  exporterPdf(
    id: number
  ): void {

    this.bonLivraisonService
      .exportPdf(id)
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const lien =
            document.createElement('a');

          lien.href = url;
          lien.download =
            `bon_livraison_${id}.pdf`;

          lien.click();

          window.URL.revokeObjectURL(url);

          this.toastService.success(
            'PDF téléchargé avec succès'
          );
        },

        error: (err) => {

          console.error(
            'Erreur export PDF Bon de livraison',
            err
          );

          this.toastService.error(
            'Erreur lors de l’export PDF du bon de livraison'
          );
        }
      });
  }

  private creerBonVide(): BonLivraison {

    return {
      numeroBon: '',
      dateLivraison: '',
      objet: '',
      statut: 'EN_PREPARATION',
      commande: {
        id: 0
      }
    };
  }
}
