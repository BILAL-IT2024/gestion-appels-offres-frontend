import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Consultation, ConsultationService } from '../../services/consultation';
import { ClientService } from '../../services/client';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [SidebarComponent, FormsModule],
  templateUrl: './consultations.html',
  styleUrl: './consultations.css',
})
export class Consultations implements OnInit {

  showForm = false;
  modeEdition = false;
  idConsultationEnCours?: number;

  consultations: any[] = [];
  keyword = '';
  clients: any[] = [];

  nouvelleConsultation: Consultation = {
    reference: '',
    objet: '',
    dateReception: '',
    montantPropose: 0,
    statut: 'EN_COURS',
    client: {
      id: 0
    }
  };

  constructor(
    private consultationService: ConsultationService,
    private clientService: ClientService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerConsultations();
    this.chargerClients();
  }

  chargerConsultations(): void {
    this.consultationService.getConsultations().subscribe({
      next: (data) => {
        this.consultations = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Erreur chargement consultations', err);
      }
    });
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

  ouvrirFormulaire(): void {

    this.modeEdition = false;
    this.idConsultationEnCours = undefined;

    this.nouvelleConsultation = {
      reference: '',
      objet: '',
      dateReception: '',
      montantPropose: 0,
      statut: 'EN_COURS',
      client: {
        id: 0
      }
    };

    this.showForm = true;
  }

enregistrerConsultation(): void {

  if (this.modeEdition && this.idConsultationEnCours) {

    this.consultationService.updateConsultation(
      this.idConsultationEnCours,
      this.nouvelleConsultation
    ).subscribe({
      next: () => {
        alert('Consultation modifiée ✅');
        this.showForm = false;
        this.modeEdition = false;
        this.idConsultationEnCours = undefined;
        this.chargerConsultations();
      },
      error: (err) => {
        console.log('Erreur modification consultation', err);
        alert('Erreur lors de la modification');
      }
    });

  } else {

    this.consultationService.saveConsultation(
      this.nouvelleConsultation
    ).subscribe({
      next: () => {
        alert('Consultation enregistrée ✅');
        this.showForm = false;
        this.chargerConsultations();
      },
      error: (err) => {
        console.log('Erreur enregistrement consultation', err);
        alert('Erreur lors de l’enregistrement');
      }
    });

  }

}

modifierConsultation(consultation: any): void {

  this.modeEdition = true;
  this.idConsultationEnCours = consultation.id;
  this.showForm = true;

  this.nouvelleConsultation = {
    reference: consultation.reference,
    objet: consultation.objet,
    dateReception: consultation.dateReception,
    montantPropose: consultation.montantPropose,
    statut: consultation.statut,
    client: {
      id: Number(consultation.client?.id)
    }
  };

}

supprimerConsultation(id: number): void {

  if (confirm('Voulez-vous vraiment supprimer cette consultation ?')) {

    this.consultationService.deleteConsultation(id).subscribe({
      next: () => {
        alert('Consultation supprimée ✅');
        this.chargerConsultations();
      },
      error: (err) => {
        console.log('Erreur suppression consultation', err);
        alert('Erreur lors de la suppression');
      }
    });

  }

}

rechercherConsultations(): void {

  if (this.keyword.trim() === '') {
    this.chargerConsultations();
    return;
  }

  this.consultationService.searchConsultations(this.keyword).subscribe({
    next: (data) => {
      this.consultations = data;
      this.cd.detectChanges();
    },
    error: (err) => {
      console.log('Erreur recherche consultations', err);
    }
  });

}

reinitialiserRecherche(): void {
  this.keyword = '';
  this.chargerConsultations();
}

exporterExcel(): void {

  this.consultationService.exportExcel().subscribe({
    next: (blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'consultations.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);

    },
    error: (err) => {
      console.log('Erreur export Excel Consultations', err);
      alert('Erreur lors de l’export Excel');
    }
  });

}

exporterPdf(id: number): void {

  this.consultationService.exportPdf(id).subscribe({
    next: (blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'consultation_' + id + '.pdf';
      a.click();

      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.log('Erreur export PDF Consultation', err);
      alert('Erreur lors de l’export PDF');
    }
  });

}

}
