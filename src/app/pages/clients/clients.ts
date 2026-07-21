import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast';

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
    private cd: ChangeDetectorRef,
     private toastService: ToastService
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

  if (
    this.modeEdition &&
    this.idClientEnCours !== undefined
  ) {

    this.clientService.updateClient(
      this.idClientEnCours,
      this.nouveauClient
    ).subscribe({

      next: () => {

        this.toastService.success(
          'Client modifié avec succès'
        );

        this.showForm = false;
        this.modeEdition = false;
        this.idClientEnCours = undefined;

        this.chargerClients();
      },

      error: (err) => {

        console.error(
          'Erreur modification client',
          err
        );

        this.toastService.error(
          'Erreur lors de la modification du client'
        );
      }
    });

  } else {

    this.clientService.saveClient(
      this.nouveauClient
    ).subscribe({

      next: () => {

        this.toastService.success(
          'Client enregistré avec succès'
        );

        this.showForm = false;

        this.chargerClients();
      },

      error: (err) => {

        console.error(
          'Erreur enregistrement client',
          err
        );

        this.toastService.error(
          'Erreur lors de l’enregistrement du client'
        );
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

  if (
    confirm(
      'Voulez-vous vraiment supprimer ce client ?'
    )
  ) {

    this.clientService.deleteClient(id).subscribe({

      next: () => {

        this.toastService.success(
          'Client supprimé avec succès'
        );

        this.chargerClients();
      },

      error: (err) => {

        console.error(
          'Erreur suppression client',
          err
        );

        this.toastService.error(
          'Erreur lors de la suppression du client'
        );
      }
    });
  }
}

rechercherClients(): void {

  const recherche = this.keyword.trim();

  if (recherche === '') {
    this.chargerClients();
    return;
  }

  this.clientService.searchClients(
    recherche
  ).subscribe({

    next: (data) => {

      this.clients = data;

      this.cd.detectChanges();

      if (data.length === 0) {
        this.toastService.info(
          'Aucun client trouvé'
        );
      }
    },

    error: (err) => {

      console.error(
        'Erreur recherche clients',
        err
      );

      this.toastService.error(
        'Erreur lors de la recherche des clients'
      );
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

      const url =
        window.URL.createObjectURL(blob);

      const lien =
        document.createElement('a');

      lien.href = url;
      lien.download = 'clients.xlsx';

      lien.click();

      window.URL.revokeObjectURL(url);

      this.toastService.success(
        'Export Excel téléchargé avec succès'
      );
    },

    error: (err) => {

      console.error(
        'Erreur export Excel Clients',
        err
      );

      this.toastService.error(
        'Erreur lors de l’export Excel des clients'
      );
    }
  });
}

exporterPdf(id: number): void {

  this.clientService.exportPdf(id).subscribe({

    next: (blob) => {

      const url =
        window.URL.createObjectURL(blob);

      const lien =
        document.createElement('a');

      lien.href = url;
      lien.download = `client_${id}.pdf`;

      lien.click();

      window.URL.revokeObjectURL(url);

      this.toastService.success(
        'PDF téléchargé avec succès'
      );
    },

    error: (err) => {

      console.error(
        'Erreur export PDF Client',
        err
      );

      this.toastService.error(
        'Erreur lors de l’export PDF du client'
      );
    }
  });
}

}
