import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Member details for quote calculation
 */
export interface QuoteMember {
  relation: 'SELF' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING';
  age: number;
  gender: 'MALE' | 'FEMALE';
}

/**
 * Quote request payload structure
 */
export interface QuoteRequest {
  quoteType: 'INDIVIDUAL' | 'FAMILY' | 'GROUP';
  members: QuoteMember[];
  cityId: number;
  sumInsured: number;
  policyTerm: number; // in years
  planType: 'INDIVIDUAL' | 'FAMILY' | 'GROUP';
  couponCode?: string;
}

/**
 * Individual insurance plan details
 */
export interface QuotePlan {
  planId: string;
  planName: string;
  premium: number;
  features: string[];
  coverage: number;
}

/**
 * Quote response from API
 */
export interface QuoteResponse {
  quoteId: string;
  plans: QuotePlan[];
  totalCost?: number;
  discount?: number;
  discountedCost?: number;
}

/**
 * Service for handling insurance quotations
 */
@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private apiUrl = `${environment.apiUrl}/quotes`;

  constructor(private http: HttpClient) {}

  /**
   * Get insurance quotes based on user details
   * @param data - Quote request with member details, coverage, and preferences
   * @returns Observable of available plans and pricing
   */
  getQuotes(data: QuoteRequest): Observable<QuoteResponse> {
    console.log('🔵 [QuoteService] getQuotes() called');
    console.log('🔵 [QuoteService] API URL:', this.apiUrl);
    console.log('🔵 [QuoteService] Request Payload:', data);
    
    // TEMPORARY: Mock response for testing
    // Comment this out when backend is ready
    const mockResponse: QuoteResponse = {
      quoteId: 'QUOTE-' + Math.random().toString(36).substr(2, 9),
      plans: [
        {
          planId: 'plan-1',
          planName: 'HDFC Ergo Optima Secure',
          premium: 4500,
          features: ['₹3L Coverage', '9500+ Hospitals', '95.2% Claim Settlement'],
          coverage: 300000
        },
        {
          planId: 'plan-2',
          planName: 'Star Health Comprehensive',
          premium: 4200,
          features: ['₹3L Coverage', '8500+ Hospitals', '92.5% Claim Settlement'],
          coverage: 300000
        },
        {
          planId: 'plan-3',
          planName: 'Apollo Munich Optima Restore',
          premium: 4800,
          features: ['₹3L Coverage', '7000+ Hospitals', '94.1% Claim Settlement'],
          coverage: 300000
        }
      ],
      totalCost: 13500,
      discountedCost: 12825
    };

    console.log('✅ [QuoteService] Returning mock response:', mockResponse);
    
    // Return mock response immediately
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockResponse);
        observer.complete();
      }, 1000); // Simulate 1s network delay
    });
    
    /* UNCOMMENT THIS WHEN BACKEND IS READY:
    return this.http.post<QuoteResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('🔴 [QuoteService] HTTP Error:', error);
        return this.handleError(error);
      })
    );
    */
  }

  /**
   * Calculate premium for specific plan
   * @param data - Quote request details
   * @param planId - Selected plan ID
   * @returns Observable of premium calculation
   */
  calculatePremium(data: QuoteRequest, planId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/calculate`, {
      ...data,
      planId
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Validate coupon code
   * @param couponCode - Code to validate
   * @param quoteRequest - Quote details for validation
   * @returns Observable of validation result
   */
  validateCoupon(couponCode: string, quoteRequest: QuoteRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate-coupon`, {
      couponCode,
      ...quoteRequest
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while fetching quotes';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}