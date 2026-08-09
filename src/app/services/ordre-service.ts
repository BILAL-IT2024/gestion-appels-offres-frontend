import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrdreService {
  id?: number;

  numeroOrdre: string;

  dateOrdre: string;

  dateDebutExecution: string;

  objet: string;

  statut: string;

  marche: {
    id: number;
    numeroMarche?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrdreServiceService {

  private apiUrl =
    'http://localhost:9090/api/ordres-service';

  constructor(
    private http: HttpClient
  ) {}

  getOrdres(): Observable<OrdreService[]> {
    return this.http.get<OrdreService[]>(
      this.apiUrl
    );
  }

  getOrdreById(
    id: number
  ): Observable<OrdreService> {
    return this.http.get<OrdreService>(
      `${this.apiUrl}/${id}`
    );
  }

  saveOrdre(
    ordre: OrdreService
  ): Observable<OrdreService> {
    return this.http.post<OrdreService>(
      this.apiUrl,
      ordre
    );
  }

  updateOrdre(
    id: number,
    ordre: OrdreService
  ): Observable<OrdreService> {
    return this.http.put<OrdreService>(
      `${this.apiUrl}/${id}`,
      ordre
    );
  }

  deleteOrdre(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  searchOrdres(
    keyword: string
  ): Observable<OrdreService[]> {
    return this.http.get<OrdreService[]>(
      `${this.apiUrl}/search`,
      {
        params: {
          keyword
        }
      }
    );
  }

  getOrdresByMarche(
    marcheId: number
  ): Observable<OrdreService[]> {
    return this.http.get<OrdreService[]>(
      `${this.apiUrl}/marche/${marcheId}`
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
