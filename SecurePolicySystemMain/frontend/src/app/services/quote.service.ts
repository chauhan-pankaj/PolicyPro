import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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

  private apiUrl = 'https://localhost:7257/api/quotes';

  constructor(private http: HttpClient) {}

  getQuotes(data: QuoteRequest): Observable<QuoteResponse> {
    const response: QuoteResponse = {
      plans: [
        { planName: 'Basic Plan', premium: 1200 },
        { planName: 'Premium Plan', premium: 2400 }
      ]
    };

    return of(response);
    // return this.http.post<QuoteResponse>(this.apiUrl, data);
  }
}