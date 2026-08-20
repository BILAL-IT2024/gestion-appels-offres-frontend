import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Facture } from '../models/facture';

export interface ResumeFacturation {
  montantLivre: number;
  montantFacture: number;
  montantRestant: number;
}

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private apiUrl =
    'http://localhost:9090/api/factures';

  constructor(
    private http: HttpClient
  ) {}

  getFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(
      this.apiUrl
    );
  }

  getResumeFacturation(
    bonLivraisonId: number
  ): Observable<ResumeFacturation> {

    return this.http.get<ResumeFacturation>(
      `${this.apiUrl}/bon-livraison/${bonLivraisonId}/resume`
    );
  }

  getFactureById(
    id: number
  ): Observable<Facture> {
    return this.http.get<Facture>(
      `${this.apiUrl}/${id}`
    );
  }

  saveFacture(
    facture: Facture
  ): Observable<Facture> {
    return this.http.post<Facture>(
      this.apiUrl,
      facture
    );
  }

  updateFacture(
    id: number,
    facture: Facture
  ): Observable<Facture> {
    return this.http.put<Facture>(
      `${this.apiUrl}/${id}`,
      facture
    );
  }

  deleteFacture(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  searchFactures(
    keyword: string
  ): Observable<Facture[]> {
    return this.http.get<Facture[]>(
      `${this.apiUrl}/search`,
      {
        params: {
          keyword
        }
      }
    );
  }

  getFacturesByBonLivraison(
    bonLivraisonId: number
  ): Observable<Facture[]> {
    return this.http.get<Facture[]>(
      `${this.apiUrl}/bon-livraison/${bonLivraisonId}`
    );
  }

  getFacturesByStatut(
    statut: string
  ): Observable<Facture[]> {
    return this.http.get<Facture[]>(
      `${this.apiUrl}/statut/${statut}`
    );
  }

  exportExcel(): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/export/excel`,
      {
        responseType: 'blob'
      }
    );
  }

  exportPdf(
    id: number
  ): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/${id}/pdf`,
      {
        responseType: 'blob'
      }
    );
  }
}
