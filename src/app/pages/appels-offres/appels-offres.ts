import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Client, ClientService } from '../../services/client';
import { AppelOffresService } from '../../services/appel-offres';

@Component({
  selector: 'app-appels-offres',
  standalone: true,
  imports: [SidebarComponent, FormsModule],
  templateUrl: './appels-offres.html',
  styleUrl: './appels-offres.css',
})
export class AppelsOffresComponent implements OnInit {

  showForm = false;

  clients: Client[] = [];
  appelsOffres: any[] = [];

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
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerClients();
    this.chargerAppelsOffres();
  }

  ouvrirFormulaire(): void {
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
    this.appelOffresService.saveAppelOffre(this.nouvelAppelOffre).subscribe({
      next: () => {
        alert('Appel d’offre enregistré ✅');
        this.showForm = false;
        this.chargerAppelsOffres();
      },
      error: (err) => {
        console.log('Erreur enregistrement AO', err);
        alert('Erreur lors de l’enregistrement');
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

}
