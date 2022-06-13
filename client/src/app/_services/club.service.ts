import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Club } from '@app/_models/club';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AccountService } from './account.service';
import { ApiResponse, PaginationResponse } from '@app/_shared';
@Injectable({
  providedIn: 'root'
})
export class ClubService {
  currentUsername: string;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.currentUsername = this.accountService.userValue.username;
   }

  getClubs(page: number, pageSize: number): Observable<PaginationResponse<Club[]>> {
    return this.http.get<PaginationResponse<Club[]>>(`${environment.apiUrl}/clubs?page=${page}&pageSize=${pageSize}`);
  }

  getClubsByUser(page?: number, pageSize?: number): Observable<Club[]> {
    const pagination = `page=${page}&pageSize=${pageSize}`
    return this.http.get<Club[]>(`${environment.apiUrl}/clubs/${this.currentUsername}${page ? pagination : ''}`);
  }

  subscribeUser(clubId: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.apiUrl}/clubs/${clubId}/subscribe/${this.currentUsername}`, {});
  }

  unsubscribeUser(clubId: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${environment.apiUrl}/clubs/${clubId}/unsubscribe/${this.currentUsername}`, {});
  }
}
