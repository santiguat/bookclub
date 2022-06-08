import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Club } from '@app/_models/club';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http: HttpClient) { }

  getClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(`${environment.apiUrl}/clubs`);
  }
}
