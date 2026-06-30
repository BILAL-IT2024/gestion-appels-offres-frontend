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

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private apiUrl = 'http://localhost:9090/api/commandes';

  constructor(private http: HttpClient) {}

  getCommandes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveCommande(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, commande);
  }

  updateCommande(id: number, commande: Commande): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}`, commande);
  }

  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

searchCommandes(keyword: string): Observable<any[]> {
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

}
