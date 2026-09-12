import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalClients: number;
  totalAppelsOffres: number;
  totalConsultations: number;

  consultationsRetenues: number;
  consultationsEnCours: number;
  consultationsRefusees: number;

  totalMarches: number;
  marchesEnCours: number;
  marchesTermines: number;
  montantTotalMarches: number;

  totalCommandes: number;
  commandesEnCours: number;
  commandesLivrees: number;
  montantTotalCommandes: number;

  totalPaiements: number;
  paiementsValides: number;
  paiementsEnAttente: number;
  paiementsAnnules: number;
  paiementMoyen: number;

  chiffreAffaireTotal: number;

  totalFactures: number;
  facturesPayees: number;
  facturesPartiellementPayees: number;
  facturesEmises: number;

  montantTotalFacture: number;
  resteTotalAEncaisser: number;
  totalEncaisse: number;

  aoAdjuges: number;
  tauxReussite: number;
  aoEnCours: number;
  aoAnnules: number;
  montantTotalAO: number;
  topClient: string;
  aoEnRetard: number;
  aoUrgents: number;
}

export interface ChiffreAffaireMensuel {
  annee: number;
  mois: number;
  total: number;
}

export interface AlerteAppelOffre {
  id: number;
  reference: string;
  objet: string;
  dateLimite: string;
  joursRestants: number;
  statut: string;
  etatAlerte: string;
}

export interface TopClient {
  client: string;
  total: number;
}

export interface DashboardDas {
  das: string;

  nombreAppelsOffres: number;
  montantAppelsOffres: number;

  nombreConsultations: number;
  montantConsultations: number;

  nombreOffres: number;
  montantOffres: number;

  nombreMarches: number;
  montantMarches: number;

  nombreOrdresService: number;

  nombreCommandes: number;
  montantCommandes: number;

  montantFacture: number;

  montantEncaisse: number;

  resteAEncaisser: number;
}

export interface ChiffreAffaireAnnuel {
  annee: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:9090/api/dashboard';

  constructor(private http: HttpClient) {}

 getStats(
    annee?: number,
    mois?: number
  ): Observable<DashboardStats> {

    let url = `${this.apiUrl}/stats`;

    const params: string[] = [];

    if (annee !== undefined && annee !== null) {
      params.push(`annee=${annee}`);
    }

    if (mois !== undefined && mois !== null) {
      params.push(`mois=${mois}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<DashboardStats>(url);
  }

getStatsDas(
  annee?: number,
  mois?: number
): Observable<DashboardDas[]> {

  let url = `${this.apiUrl}/stats-das`;
  const params: string[] = [];

  if (annee !== undefined && annee !== null) {
    params.push(`annee=${annee}`);
  }

  if (mois !== undefined && mois !== null) {
    params.push(`mois=${mois}`);
  }

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  return this.http.get<DashboardDas[]>(url);
}

getChiffreAffaireMensuel(
  annee?: number
): Observable<ChiffreAffaireMensuel[]> {

  let url = `${this.apiUrl}/chiffre-affaire-mensuel`;

  if (annee !== undefined && annee !== null) {
    url += `?annee=${annee}`;
  }

  return this.http.get<ChiffreAffaireMensuel[]>(url);
}

getAlertesAppelsOffres(): Observable<AlerteAppelOffre[]> {

  return this.http.get<AlerteAppelOffre[]>(
    `${this.apiUrl}/alertes/appels-offres`
  );

}

getTopClients(
  annee?: number,
  mois?: number
): Observable<TopClient[]> {

  let url = `${this.apiUrl}/top-clients`;
  const params: string[] = [];

  if (annee !== undefined && annee !== null) {
    params.push(`annee=${annee}`);
  }

  if (mois !== undefined && mois !== null) {
    params.push(`mois=${mois}`);
  }

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  return this.http.get<TopClient[]>(url);
}

getChiffreAffaireAnnuel(): Observable<ChiffreAffaireAnnuel[]> {
  return this.http.get<ChiffreAffaireAnnuel[]>(
    `${this.apiUrl}/chiffre-affaire-annuel`
  );
}

}
