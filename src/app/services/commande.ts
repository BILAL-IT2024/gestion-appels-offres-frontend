import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Commande {
  id?: number;
  numeroCommande: string;
  dateCommande: string;
  montantCommande: number;
  statut: string;
  marche: {
    id: number;
  };
}

export interface ResumeMarche {
  montantMarche: number;
  montantCommande: number;
  montantRestant: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private apiUrl =
    'http://localhost:9090/api/commandes';

  constructor(
    private http: HttpClient
  ) {}

  getCommandes(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  saveCommande(
    commande: Commande
  ): Observable<Commande> {
    return this.http.post<Commande>(
      this.apiUrl,
      commande
    );
  }

  updateCommande(
    id: number,
    commande: Commande
  ): Observable<Commande> {
    return this.http.put<Commande>(
      `${this.apiUrl}/${id}`,
      commande
    );
  }

  deleteCommande(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  searchCommandes(
    keyword: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/search`,
      {
        params: {
          keyword
        }
      }
    );
  }

  getResumeMarche(
    marcheId: number
  ): Observable<ResumeMarche> {
    return this.http.get<ResumeMarche>(
      `${this.apiUrl}/marche/${marcheId}/resume`
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
