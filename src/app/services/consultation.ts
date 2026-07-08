import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Consultation {
  id?: number;
  reference: string;
  objet: string;
  dateReception: string;
  montantPropose: number;
  statut: string;
  client: {
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  private apiUrl = 'http://localhost:9090/api/consultations';

  constructor(private http: HttpClient) {}

  getConsultations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveConsultation(consultation: Consultation): Observable<Consultation> {
    return this.http.post<Consultation>(this.apiUrl, consultation);
  }

  updateConsultation(id: number, consultation: Consultation): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.apiUrl}/${id}`, consultation);
  }

  deleteConsultation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

searchConsultations(keyword: string): Observable<any[]> {
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
