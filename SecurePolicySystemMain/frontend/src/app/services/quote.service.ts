import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface QuoteRequest {
  age: number;
  gender: string;
  city: string;
  sumInsured: number;
  policyTerm: number;
}

export interface QuotePlan {
  planName: string;
  premium: number;
}

export interface QuoteResponse {
  plans: QuotePlan[];
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private apiUrl = `${environment.apiUrl}/quotes`;

  constructor(private http: HttpClient) {}

  getQuotes(data: QuoteRequest): Observable<QuoteResponse> {
    return this.http.post<QuoteResponse>(this.apiUrl, data);
  }
}