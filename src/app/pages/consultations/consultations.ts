import {
  AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

import {
  Consultation,
  ConsultationService
} from '../../services/consultation';

import {
  Client,
  ClientService
} from '../../services/client';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [
    SidebarComponent,
    FormsModule
  ],
  templateUrl: './consultations.html',
  styleUrl: './consultations.css'
})
export class Consultations implements OnInit, AfterViewInit {

  @ViewChild('tableContainer')
  tableContainer?: ElementRef<HTMLDivElement>;

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
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerConsultations();
    this.chargerClients();
  }

  private creerConsultationVide(): Consultation {
    return {
      reference: '',
      objet: '',
      dateReception: '',
      montantPropose: 0,
      statut: 'EN_COURS',
      client: {
        id: 0
      }
    };
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
  }

  enregistrerConsultation(): void {

    if (
      !this.nouvelleConsultation.reference.trim() ||
      !this.nouvelleConsultation.objet.trim() ||
      !this.nouvelleConsultation.dateReception ||
      this.nouvelleConsultation.montantPropose <= 0 ||
      this.nouvelleConsultation.client.id === 0
    ) {
      alert(
        'Veuillez remplir correctement tous les champs.'
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
            alert('Consultation modifiée ✅');

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

            alert(
              'Erreur lors de la modification'
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
          alert('Consultation enregistrée ✅');

          this.showForm = false;

          this.chargerConsultations();
        },

        error: (err) => {
          console.error(
            'Erreur enregistrement consultation',
            err
          );

          alert(
            'Erreur lors de l’enregistrement'
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

  supprimerConsultation(
    id: number
  ): void {

    const confirmation = confirm(
      'Voulez-vous vraiment supprimer cette consultation ?'
    );

    if (!confirmation) {
      return;
    }

    this.consultationService
      .deleteConsultation(id)
      .subscribe({

        next: () => {
          alert('Consultation supprimée ✅');

          this.chargerConsultations();
        },

        error: (err) => {
          console.error(
            'Erreur suppression consultation',
            err
          );

          alert(
            'Erreur lors de la suppression'
          );
        }

      });
  }

  rechercherConsultations(): void {

    const recherche =
      this.keyword.trim();

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
        },

        error: (err) => {
          console.error(
            'Erreur recherche consultations',
            err
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
          lien.download =
            'consultations.xlsx';

          lien.click();

          window.URL.revokeObjectURL(url);
        },

        error: (err) => {
          console.error(
            'Erreur export Excel Consultations',
            err
          );

          alert(
            'Erreur lors de l’export Excel'
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
          lien.download =
            `consultation_${id}.pdf`;

          lien.click();

          window.URL.revokeObjectURL(url);
        },

        error: (err) => {
          console.error(
            'Erreur export PDF Consultation',
            err
          );

          alert(
            'Erreur lors de l’export PDF'
          );
        }

      });
  }

ngAfterViewInit(): void {
  setTimeout(() => {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollLeft = 0;
    }
  });
}

}
