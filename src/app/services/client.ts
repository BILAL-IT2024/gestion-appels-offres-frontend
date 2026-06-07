import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  id: number;
  raisonSociale: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:9090/api/clients';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {

    const token = localStorage.getItem('token');

    return this.http.get<Client[]>(
      this.apiUrl,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
