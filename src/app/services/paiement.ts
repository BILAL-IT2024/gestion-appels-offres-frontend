import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Paiement {
  id?: number;
  datePaiement: string;
  montantPaiement: number;
  modePaiement: string;
  referencePaiement: string;
  commande: {
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private apiUrl = 'http://localhost:9090/api/paiements';

  constructor(private http: HttpClient) {}

  getPaiements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  savePaiement(paiement: Paiement): Observable<Paiement> {
    return this.http.post<Paiement>(this.apiUrl, paiement);
  }

  updatePaiement(id: number, paiement: Paiement): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}/${id}`, paiement);
  }

  deletePaiement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

searchPaiements(keyword: string): Observable<any[]> {
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
