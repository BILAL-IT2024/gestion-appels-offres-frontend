import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalClients: number;
  totalAppelsOffres: number;
  totalConsultations: number;
  totalMarches: number;
  totalCommandes: number;
  totalPaiements: number;
  chiffreAffaireTotal: number;
  aoAdjuges: number;
  tauxReussite: number;
  aoEnCours: number;
  aoAnnules: number;
  montantTotalAO: number;
  topClient: string;
  aoEnRetard: number;
  aoUrgents: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:9090/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${this.apiUrl}/stats`
    );
  }
}
