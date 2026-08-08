import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Offre {
  id?: number;

  reference: string;

  dateOffre: string;

  montantOffre: number;

  statut: string;

  das?: string;

  appelDoffres?: {
    id: number;
    reference?: string;
    das?: string;
  } | null;

  consultation?: {
    id: number;
    reference?: string;
    das?: string;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class OffreService {

  private apiUrl =
    'http://localhost:9090/api/offres';

  constructor(
    private http: HttpClient
  ) {}

  getOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(
      this.apiUrl
    );
  }

  getOffreById(
    id: number
  ): Observable<Offre> {
    return this.http.get<Offre>(
      `${this.apiUrl}/${id}`
    );
  }

  saveOffre(
    offre: Offre
  ): Observable<Offre> {
    return this.http.post<Offre>(
      this.apiUrl,
      offre
    );
  }

  updateOffre(
    id: number,
    offre: Offre
  ): Observable<Offre> {
    return this.http.put<Offre>(
      `${this.apiUrl}/${id}`,
      offre
    );
  }

  deleteOffre(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  searchOffres(
    keyword: string
  ): Observable<Offre[]> {
    return this.http.get<Offre[]>(
      `${this.apiUrl}/search`,
      {
        params: {
          keyword
        }
      }
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

exportPdf(id: number): Observable<Blob> {

  return this.http.get(
    `${this.apiUrl}/${id}/pdf`,
    {
      responseType: 'blob'
    }
  );
}

}
