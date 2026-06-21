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
  modeEdition = false;
  idAppelOffreEnCours?: number;

  clients: Client[] = [];
  appelsOffres: any[] = [];
  keyword = '';

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

    this.modeEdition = false;
    this.idAppelOffreEnCours = undefined;

    this.nouvelAppelOffre = {
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

    if (this.modeEdition && this.idAppelOffreEnCours) {

      this.appelOffresService.updateAppelOffre(
        this.idAppelOffreEnCours,
        this.nouvelAppelOffre
      ).subscribe({
        next: () => {
          alert('Appel d’offre modifié ✅');
          this.showForm = false;
          this.modeEdition = false;
          this.idAppelOffreEnCours = undefined;
          this.chargerAppelsOffres();
        },
        error: (err) => {
          console.log('Erreur modification AO', err);
          alert('Erreur lors de la modification');
        }
      });

    } else {

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

  supprimerAppelOffre(id: number): void {

    if (confirm('Voulez-vous vraiment supprimer cet appel d’offre ?')) {

      this.appelOffresService.deleteAppelOffre(id).subscribe({
        next: () => {
          alert('Appel d’offre supprimé ✅');
          this.chargerAppelsOffres();
        },
        error: (err) => {
          console.log('Erreur suppression AO', err);
          alert('Erreur lors de la suppression');
        }
      });

    }
  }

  modifierAppelOffre(ao: any): void {

    this.modeEdition = true;
    this.idAppelOffreEnCours = ao.id;
    this.showForm = true;

    this.nouvelAppelOffre = {
      reference: ao.reference,
      objet: ao.objet,
      datePublication: ao.datePublication,
      dateLimite: ao.dateLimite,
      montantEstime: ao.montantEstime,
      statut: ao.statut,
      client: {
        id: Number(ao.client?.id ?? ao.clientId)
      }
    };

  }

  rechercherAppelsOffres(): void {

    if (this.keyword.trim() === '') {
      this.chargerAppelsOffres();
      return;
    }

    this.appelOffresService.searchAppelsOffres(this.keyword).subscribe({
      next: (data) => {
        this.appelsOffres = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Erreur recherche AO', err);
      }
    });

  }

  reinitialiserRecherche(): void {
    this.keyword = '';
    this.chargerAppelsOffres();
  }

}
