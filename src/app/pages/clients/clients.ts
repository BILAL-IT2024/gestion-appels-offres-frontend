import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Client, ClientService } from '../../services/client';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [SidebarComponent, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements OnInit {

  showForm = false;
  modeEdition = false;
  idClientEnCours?: number;

  clients: Client[] = [];
  keyword = '';

  nouveauClient: Client = {
    raisonSociale: '',
    adresse: '',
    telephone: '',
    email: '',
    typeClient: 'PUBLIC'
  };

  constructor(
    private clientService: ClientService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerClients();
  }

  chargerClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Erreur chargement clients', err);
      }
    });
  }

  ouvrirFormulaire(): void {
    this.modeEdition = false;
    this.idClientEnCours = undefined;

    this.nouveauClient = {
      raisonSociale: '',
      adresse: '',
      telephone: '',
      email: '',
      typeClient: 'PUBLIC'
    };

    this.showForm = true;
  }

enregistrerClient(): void {

  if (this.modeEdition && this.idClientEnCours) {

    this.clientService.updateClient(
      this.idClientEnCours,
      this.nouveauClient
    ).subscribe({
      next: () => {
        alert('Client modifié ✅');
        this.showForm = false;
        this.modeEdition = false;
        this.idClientEnCours = undefined;
        this.chargerClients();
      },
      error: (err) => {
        console.log('Erreur modification client', err);
        alert('Erreur lors de la modification');
      }
    });

  } else {

    this.clientService.saveClient(this.nouveauClient).subscribe({
      next: () => {
        alert('Client enregistré ✅');
        this.showForm = false;
        this.chargerClients();
      },
      error: (err) => {
        console.log('Erreur enregistrement client', err);
        alert('Erreur lors de l’enregistrement');
      }
    });

  }

}

modifierClient(client: Client): void {

  this.modeEdition = true;
  this.idClientEnCours = client.id;
  this.showForm = true;

  this.nouveauClient = {
    raisonSociale: client.raisonSociale,
    adresse: client.adresse,
    telephone: client.telephone,
    email: client.email,
    typeClient: client.typeClient
  };

}

supprimerClient(id: number): void {

  if (confirm('Voulez-vous vraiment supprimer ce client ?')) {

    this.clientService.deleteClient(id).subscribe({
      next: () => {
        alert('Client supprimé ✅');
        this.chargerClients();
      },
      error: (err) => {
        console.log('Erreur suppression client', err);
        alert('Erreur lors de la suppression');
      }
    });

  }

}

rechercherClients(): void {

  if (this.keyword.trim() === '') {
    this.chargerClients();
    return;
  }

  this.clientService.searchClients(this.keyword).subscribe({
    next: (data) => {
      this.clients = data;
      this.cd.detectChanges();
    },
    error: (err) => {
      console.log('Erreur recherche clients', err);
    }
  });

}

reinitialiserRecherche(): void {
  this.keyword = '';
  this.chargerClients();
}

exporterExcel(): void {

  this.clientService.exportExcel().subscribe({
    next: (blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'clients.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);

    },
    error: (err) => {
      console.log('Erreur export Excel Clients', err);
      alert('Erreur lors de l’export Excel');
    }
  });

}

exporterPdf(id: number): void {

  this.clientService.exportPdf(id).subscribe({
    next: (blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'client_' + id + '.pdf';
      a.click();

      window.URL.revokeObjectURL(url);

    },
    error: (err) => {
      console.log('Erreur export PDF Client', err);
      alert('Erreur lors de l’export PDF');
    }
  });

}

}
