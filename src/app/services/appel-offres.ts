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

    const token = localStorage.getItem('token');

    return this.http.post<AppelOffre>(
      this.apiUrl,
      appelOffre,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getAppelsOffres(): Observable<any[]> {

    const token = localStorage.getItem('token');

    return this.http.get<any[]>(
      this.apiUrl,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
