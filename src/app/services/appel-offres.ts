import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppelOffre {
  id?: number;
  reference: string;
  objet: string;
  datePublication: string;
  dateLimite: string;
  montantEstime: number;
  statut: string;
  client: {
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AppelOffresService {

  private apiUrl = 'http://localhost:9090/api/appels-offres';

  constructor(private http: HttpClient) {}

  saveAppelOffre(appelOffre: AppelOffre): Observable<AppelOffre> {
    return this.http.post<AppelOffre>(
      this.apiUrl,
      appelOffre
    );
  }

  getAppelsOffres(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteAppelOffre(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  updateAppelOffre(id: number, appelOffre: AppelOffre): Observable<AppelOffre> {
    return this.http.put<AppelOffre>(
      `${this.apiUrl}/${id}`,
      appelOffre
    );
  }

  searchAppelsOffres(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/search?keyword=${keyword}`
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
