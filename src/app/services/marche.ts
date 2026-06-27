import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Marche {
  id?: number;
  numeroMarche: string;
  dateDebut: string;
  dateFin: string;
  montantMarche: number;
  tauxExecution: number;
  statut: string;
  appelDoffres: {
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MarcheService {

  private apiUrl = 'http://localhost:9090/api/marches';

  constructor(private http: HttpClient) {}

  getMarches(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveMarche(marche: Marche): Observable<Marche> {
    return this.http.post<Marche>(this.apiUrl, marche);
  }

  updateMarche(id: number, marche: Marche): Observable<Marche> {
    return this.http.put<Marche>(
      `${this.apiUrl}/${id}`,
      marche
    );
  }

  deleteMarche(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
