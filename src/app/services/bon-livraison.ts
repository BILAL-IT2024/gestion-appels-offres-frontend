import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BonLivraison {
  id?: number;

  numeroBon: string;

  dateLivraison: string;

  objet: string;

  statut: string;

  commande: {
    id: number;
    numeroCommande?: string;

    marche?: {
      id?: number;
      numeroMarche?: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class BonLivraisonService {

  private apiUrl =
    'http://localhost:9090/api/bons-livraison';

  constructor(
    private http: HttpClient
  ) {}

  getBonsLivraison(): Observable<BonLivraison[]> {
    return this.http.get<BonLivraison[]>(
      this.apiUrl
    );
  }

  getBonLivraisonById(
    id: number
  ): Observable<BonLivraison> {
    return this.http.get<BonLivraison>(
      `${this.apiUrl}/${id}`
    );
  }

  saveBonLivraison(
    bon: BonLivraison
  ): Observable<BonLivraison> {
    return this.http.post<BonLivraison>(
      this.apiUrl,
      bon
    );
  }

  updateBonLivraison(
    id: number,
    bon: BonLivraison
  ): Observable<BonLivraison> {
    return this.http.put<BonLivraison>(
      `${this.apiUrl}/${id}`,
      bon
    );
  }

  deleteBonLivraison(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  searchBonsLivraison(
    keyword: string
  ): Observable<BonLivraison[]> {
    return this.http.get<BonLivraison[]>(
      `${this.apiUrl}/search`,
      {
        params: {
          keyword
        }
      }
    );
  }

  getBonsByCommande(
    commandeId: number
  ): Observable<BonLivraison[]> {
    return this.http.get<BonLivraison[]>(
      `${this.apiUrl}/commande/${commandeId}`
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
