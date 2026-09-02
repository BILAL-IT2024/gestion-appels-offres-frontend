import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

import { Facture } from '../../models/facture';

import {
  FactureService,
  ResumeFacturation
} from '../../services/facture';

import {
  BonLivraisonService
} from '../../services/bon-livraison';

import { ToastService } from '../../services/toast';

import {
  ConfirmDialogService
} from '../../services/confirm-dialog';

import { Topbar } from '../../layout/topbar/topbar';

@Component({
  selector: 'app-factures',
  standalone: true,
  imports: [
    SidebarComponent,
    FormsModule,
    DecimalPipe,
    Topbar
  ],
  templateUrl: './factures.html',
  styleUrl: './factures.css',
})
export class Factures implements OnInit {

  showForm = false;
  modeEdition = false;

  idFactureEnCours?: number;

  factures: Facture[] = [];
  bonsLivraison: any[] = [];

  resumeFacturation?: ResumeFacturation;

  keyword = '';
  filtreStatut = '';

  nouvelleFacture: Facture =
    this.creerFactureVide();

  constructor(
    private factureService: FactureService,
    private bonLivraisonService: BonLivraisonService,
    private cd: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.chargerFactures();
    this.chargerBonsLivraison();
  }

  chargerFactures(): void {

    this.factureService
      .getFactures()
      .subscribe({

        next: (data) => {
          this.factures = data;
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement factures',
            err
          );

          this.toastService.error(
            'Erreur lors du chargement des factures'
          );
        }
      });
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

  ouvrirFormulaire(): void {

    this.modeEdition = false;
    this.idFactureEnCours = undefined;

    this.nouvelleFacture =
      this.creerFactureVide();

    this.showForm = true;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  fermerFormulaire(): void {

    this.showForm = false;
    this.modeEdition = false;
    this.idFactureEnCours = undefined;
  }

  chargerResumeFacturation(
    bonLivraisonId: number
  ): void {

    if (!bonLivraisonId || bonLivraisonId === 0) {
      this.resumeFacturation = undefined;
      return;
    }

    this.factureService
      .getResumeFacturation(bonLivraisonId)
      .subscribe({

        next: (data) => {
          this.resumeFacturation = data;
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(
            'Erreur chargement résumé facturation',
            err
          );

          this.resumeFacturation = undefined;

          this.toastService.error(
            'Erreur lors du chargement du résumé de facturation'
          );
        }
      });
  }

  calculerMontantTTC(): void {

    const montantHT =
      Number(this.nouvelleFacture.montantHT) || 0;

    const tva =
      Number(this.nouvelleFacture.tva) || 0;

    this.nouvelleFacture.montantTTC =
      Math.round(
        montantHT * (1 + tva / 100) * 100
      ) / 100;
  }

  enregistrerFacture(): void {

    if (
      !this.nouvelleFacture.numeroFacture.trim() ||
      !this.nouvelleFacture.dateFacture ||
      !this.nouvelleFacture.dateEcheance ||
      this.nouvelleFacture.montantHT <= 0 ||
      this.nouvelleFacture.tva < 0 ||
      this.nouvelleFacture.bonLivraison.id === 0
    ) {

      this.toastService.warning(
        'Veuillez remplir correctement tous les champs'
      );

      return;
    }

    const montantHT =
      Number(this.nouvelleFacture.montantHT) || 0;

    if (
      !this.modeEdition &&
      this.resumeFacturation &&
      montantHT > this.resumeFacturation.montantRestant
    ) {

      this.toastService.warning(
        `Le montant HT dépasse le reste à facturer : ${
          this.resumeFacturation.montantRestant
        } DH HT`
      );

      return;
    }

    if (
      this.modeEdition &&
      this.idFactureEnCours !== undefined
    ) {

      this.factureService
        .updateFacture(
          this.idFactureEnCours,
          this.nouvelleFacture
        )
        .subscribe({

          next: () => {

            this.toastService.success(
              'Facture modifiée avec succès'
            );

            this.showForm = false;
            this.modeEdition = false;
            this.idFactureEnCours = undefined;

            this.chargerFactures();
          },

          error: (err) => {

            console.error(
              'Erreur modification facture',
              err
            );

            const message =
              err?.error?.message
              || 'Erreur lors de la modification de la facture';

            this.toastService.error(message);
          }
        });

      return;
    }

    this.factureService
      .saveFacture(
        this.nouvelleFacture
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Facture enregistrée avec succès'
          );

          this.showForm = false;

          this.chargerFactures();
        },

        error: (err) => {

          console.error(
            'Erreur enregistrement facture',
            err
          );

          const message =
            err?.error?.message
            || 'Erreur lors de l’enregistrement de la facture';

          this.toastService.error(message);
        }
      });
  }

  modifierFacture(
    facture: Facture
  ): void {

    this.modeEdition = true;
    this.idFactureEnCours = facture.id;
    this.showForm = true;

    this.nouvelleFacture = {

      numeroFacture:
        facture.numeroFacture,

      dateFacture:
        facture.dateFacture,

      dateEcheance:
        facture.dateEcheance,

      montantHT:
        facture.montantHT,

      tva:
        facture.tva,

      montantTTC:
        facture.montantTTC,

      statut:
        facture.statut,

      bonLivraison: {
        id: Number(
          facture.bonLivraison?.id ?? 0
        )
      }
    };

    this.chargerResumeFacturation(
      Number(facture.bonLivraison?.id ?? 0)
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  supprimerFacture(
    id: number
  ): void {

    this.confirmDialogService.open({

      title: 'Supprimer la facture',

      message:
        'Voulez-vous vraiment supprimer cette facture ? Cette action est irréversible.',

      confirmText: 'Supprimer',

      cancelText: 'Annuler',

      onConfirm: () => {

        this.factureService
          .deleteFacture(id)
          .subscribe({

            next: () => {

              this.toastService.success(
                'Facture supprimée avec succès'
              );

              this.chargerFactures();
            },

            error: (err) => {

              console.error(
                'Erreur suppression facture',
                err
              );

              const message =
                err?.error?.message
                || 'Erreur lors de la suppression de la facture';

              this.toastService.error(message);
            }
          });
      }
    });
  }

  rechercherFactures(): void {

    const recherche =
      this.keyword.trim();

    if (!recherche) {
      this.chargerFactures();
      return;
    }

    this.factureService
      .searchFactures(recherche)
      .subscribe({

        next: (data) => {

          this.factures = data;
          this.cd.detectChanges();

          if (data.length === 0) {

            this.toastService.info(
              'Aucune facture trouvée'
            );
          }
        },

        error: (err) => {

          console.error(
            'Erreur recherche factures',
            err
          );

          this.toastService.error(
            'Erreur lors de la recherche des factures'
          );
        }
      });
  }

  filtrerParStatut(): void {

    if (!this.filtreStatut) {
      this.chargerFactures();
      return;
    }

    this.factureService
      .getFacturesByStatut(
        this.filtreStatut
      )
      .subscribe({

        next: (data) => {

          this.factures = data;
          this.cd.detectChanges();

          if (data.length === 0) {
            this.toastService.info(
              'Aucune facture avec ce statut'
            );
          }
        },

        error: (err) => {

          console.error(
            'Erreur filtre factures',
            err
          );

          this.toastService.error(
            'Erreur lors du filtrage des factures'
          );
        }
      });
  }

  reinitialiserRecherche(): void {

    this.keyword = '';
    this.filtreStatut = '';

    this.chargerFactures();
  }

  exporterExcel(): void {

    this.factureService
      .exportExcel()
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const lien =
            document.createElement('a');

          lien.href = url;
          lien.download =
            'factures.xlsx';

          lien.click();

          window.URL.revokeObjectURL(url);

          this.toastService.success(
            'Export Excel téléchargé avec succès'
          );
        },

        error: (err) => {

          console.error(
            'Erreur export Excel Factures',
            err
          );

          this.toastService.error(
            'Erreur lors de l’export Excel des factures'
          );
        }
      });
  }

  exporterPdf(
    id: number
  ): void {

    this.factureService
      .exportPdf(id)
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const lien =
            document.createElement('a');

          lien.href = url;

          lien.download =
            `facture_${id}.pdf`;

          lien.click();

          window.URL.revokeObjectURL(url);

          this.toastService.success(
            'PDF téléchargé avec succès'
          );
        },

        error: (err) => {

          console.error(
            'Erreur export PDF Facture',
            err
          );

          this.toastService.error(
            'Erreur lors de l’export PDF de la facture'
          );
        }
      });
  }

  private creerFactureVide(): Facture {

    return {

      numeroFacture: '',

      dateFacture: '',

      dateEcheance: '',

      montantHT: 0,

      tva: 20,

      montantTTC: 0,

      statut: 'BROUILLON',

      bonLivraison: {
        id: 0
      }
    };
  }
}
