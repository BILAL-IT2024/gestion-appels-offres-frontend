import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../layout/sidebar/sidebar';
import { Marche, MarcheService } from '../../services/marche';
import { AppelOffresService } from '../../services/appel-offres';

@Component({
  selector: 'app-marches',
  standalone: true,
  imports: [SidebarComponent, FormsModule],
  templateUrl: './marches.html',
  styleUrl: './marches.css',
})
export class Marches implements OnInit {

  showForm = false;
  modeEdition = false;
  idMarcheEnCours?: number;

  marches: any[] = [];
  keyword = '';
  appelsOffres: any[] = [];

  nouveauMarche: Marche = {
    numeroMarche: '',
    dateDebut: '',
    dateFin: '',
    montantMarche: 0,
    tauxExecution: 0,
    statut: 'EN_COURS',
    appelDoffres: {
      id: 0
    }
  };

  constructor(
    private marcheService: MarcheService,
    private appelOffresService: AppelOffresService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerMarches();
    this.chargerAppelsOffres();
  }

  chargerMarches(): void {
    this.marcheService.getMarches().subscribe({
      next: (data) => {
        this.marches = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('Erreur chargement marchés', err);
      }
    });
  }

  chargerAppelsOffres(): void {
    this.appelOffresService.getAppelsOffres().subscribe({
      next: (data) => {
        this.appelsOffres = data;
      },
      error: (err) => {
        console.log('Erreur chargement AO', err);
      }
    });
  }

ouvrirFormulaire(): void {

  this.modeEdition = false;
  this.idMarcheEnCours = undefined;

  this.nouveauMarche = {
    numeroMarche: '',
    dateDebut: '',
    dateFin: '',
    montantMarche: 0,
    tauxExecution: 0,
    statut: 'EN_COURS',
    appelDoffres: {
      id: 0
    }
  };

  this.showForm = true;
}

enregistrerMarche(): void {

  if (this.modeEdition && this.idMarcheEnCours) {

    this.marcheService.updateMarche(
      this.idMarcheEnCours,
      this.nouveauMarche
    ).subscribe({
      next: () => {
        alert('Marché modifié ✅');
        this.showForm = false;
        this.modeEdition = false;
        this.idMarcheEnCours = undefined;
        this.chargerMarches();
      },
      error: (err) => {
        console.log('Erreur modification marché', err);
        alert('Erreur lors de la modification');
      }
    });

  } else {

    this.marcheService.saveMarche(this.nouveauMarche).subscribe({
      next: () => {
        alert('Marché enregistré ✅');
        this.showForm = false;
        this.chargerMarches();
      },
      error: (err) => {
        console.log('Erreur enregistrement marché', err);
        alert('Erreur lors de l’enregistrement');
      }
    });

  }
}

supprimerMarche(id: number): void {

  if (confirm('Voulez-vous vraiment supprimer ce marché ?')) {

    this.marcheService.deleteMarche(id).subscribe({
      next: () => {
        alert('Marché supprimé ✅');
        this.chargerMarches();
      },
      error: (err) => {
        console.log('Erreur suppression marché', err);
        alert('Erreur lors de la suppression');
      }
    });

  }
}

modifierMarche(marche: any): void {

  this.modeEdition = true;
  this.idMarcheEnCours = marche.id;
  this.showForm = true;

  this.nouveauMarche = {
    numeroMarche: marche.numeroMarche,
    dateDebut: marche.dateDebut,
    dateFin: marche.dateFin,
    montantMarche: marche.montantMarche,
    tauxExecution: marche.tauxExecution,
    statut: marche.statut,
    appelDoffres: {
      id: Number(marche.appelDoffres?.id)
    }
  };

}

rechercherMarches(): void {

  if (this.keyword.trim() === '') {
    this.chargerMarches();
    return;
  }

  this.marcheService.searchMarches(this.keyword).subscribe({
    next: (data) => {
      this.marches = data;
      this.cd.detectChanges();
    },
    error: (err) => {
      console.log('Erreur recherche marchés', err);
    }
  });

}

reinitialiserRecherche(): void {
  this.keyword = '';
  this.chargerMarches();
}

exporterExcel(): void {

  this.marcheService.exportExcel().subscribe({
    next: (blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'marches.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.log('Erreur export Excel Marchés', err);
      alert('Erreur lors de l’export Excel');
    }
  });

}

exporterPdf(id: number): void {

  this.marcheService.exportPdf(id).subscribe({
    next: (blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'marche_' + id + '.pdf';
      a.click();

      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.log('Erreur export PDF Marché', err);
      alert('Erreur lors de l’export PDF');
    }
  });

}

}
