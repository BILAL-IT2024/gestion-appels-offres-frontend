import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { SidebarComponent } from '../../layout/sidebar/sidebar';

import {
  DashboardService,
  ChiffreAffaireMensuel,
  ChiffreAffaireAnnuel,
  TopClient
} from '../../services/dashboard';

import Chart from 'chart.js/auto';

import { Topbar } from '../../layout/topbar/topbar';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [
    SidebarComponent,
    DecimalPipe,
    FormsModule,
    Topbar
  ],
  templateUrl: './statistiques.html',
  styleUrl: './statistiques.css'
})
export class Statistiques implements OnInit {

  chiffreAffaireMensuel: ChiffreAffaireMensuel[] = [];
  chiffreAffaireAnnuel: ChiffreAffaireAnnuel[] = [];
  topClients: TopClient[] = [];

  anneeSelectionnee: number = new Date().getFullYear();
  moisSelectionne: number | null = null;

  annees: number[] = [
    2026,
    2025,
    2024,
    2023
  ];

  mois = [
    { numero: 1, nom: 'Janvier' },
    { numero: 2, nom: 'Février' },
    { numero: 3, nom: 'Mars' },
    { numero: 4, nom: 'Avril' },
    { numero: 5, nom: 'Mai' },
    { numero: 6, nom: 'Juin' },
    { numero: 7, nom: 'Juillet' },
    { numero: 8, nom: 'Août' },
    { numero: 9, nom: 'Septembre' },
    { numero: 10, nom: 'Octobre' },
    { numero: 11, nom: 'Novembre' },
    { numero: 12, nom: 'Décembre' }
  ];

  caChart: any;
  clientsChart: any;

  constructor(
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerChiffreAffaireMensuel();
    this.chargerChiffreAffaireAnnuel();
    this.chargerTopClients();
  }


  chargerChiffreAffaireMensuel(): void {

    this.dashboardService
      .getChiffreAffaireMensuel(this.anneeSelectionnee)
      .subscribe({
      next: (data) => {
        this.chiffreAffaireMensuel = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur CA mensuel', err);
      }
    });
  }



  chargerChiffreAffaireAnnuel(): void {

    this.dashboardService
      .getChiffreAffaireAnnuel()
      .subscribe({
        next: (data) => {
          this.chiffreAffaireAnnuel = data;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Erreur CA annuel', err);
        }
      });
  }

  calculerEvolutionAnnuelle(index: number): number | null {

    if (index === 0) {
      return null;
    }

    const precedent = this.chiffreAffaireAnnuel[index - 1].total;
    const actuel = this.chiffreAffaireAnnuel[index].total;

    if (precedent === 0) {
      return null;
    }

    return ((actuel - precedent) / precedent) * 100;
  }

  get meilleurMois(): ChiffreAffaireMensuel | null {

    if (this.chiffreAffaireMensuel.length === 0) {
      return null;
    }

    return this.chiffreAffaireMensuel.reduce(
      (meilleur, actuel) =>
        actuel.total > meilleur.total ? actuel : meilleur
    );
  }

  getNomMois(numero: number): string {

    const moisTrouve = this.mois.find(
      item => item.numero === numero
    );

    return moisTrouve?.nom ?? '';
  }

  get chiffreAffaireMensuelMoyen(): number {

    if (this.chiffreAffaireMensuel.length === 0) {
      return 0;
    }

    const total = this.chiffreAffaireMensuel.reduce(
      (somme, item) => somme + item.total,
      0
    );

    return total / this.chiffreAffaireMensuel.length;
  }

  get moyenneChiffreAffaireQuatreAns(): number {

    const anneesConcernees = [
      2023,
      2024,
      2025,
      2026
    ];

    const totalQuatreAns = anneesConcernees.reduce(
      (somme, annee) => {

        const resultat = this.chiffreAffaireAnnuel.find(
          item => item.annee === annee
        );

        return somme + (resultat?.total ?? 0);
      },
      0
    );

    return totalQuatreAns / 4;
  }


  chargerTopClients(): void {

    this.dashboardService
      .getTopClients(
        this.anneeSelectionnee,
        this.moisSelectionne ?? undefined
      )
      .subscribe({
      next: (data) => {
        this.topClients = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erreur top clients', err);
      }
    });
  }

  calculerPartClient(totalClient: number): number {

    const total = this.topClients.reduce(
      (somme, client) => somme + client.total,
      0
    );

    if (total === 0) {
      return 0;
    }

    return (totalClient / total) * 100;
  }


  get libellePeriode(): string {

    if (this.moisSelectionne === null) {
      return `Vue annuelle — ${this.anneeSelectionnee}`;
    }

    const moisSelectionne = this.mois.find(
      item => item.numero === this.moisSelectionne
    );

    return `Vue mensuelle — ${moisSelectionne?.nom ?? ''} ${this.anneeSelectionnee}`;
  }

  get totalChiffreAffairesAnnuel(): number {
    return this.chiffreAffaireMensuel.reduce(
      (total, item) => total + item.total,
      0
    );
  }


  changerPeriode(): void {
    this.chargerChiffreAffaireMensuel();
    this.chargerTopClients();
  }

}
