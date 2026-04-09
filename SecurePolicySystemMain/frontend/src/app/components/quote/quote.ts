import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Local types to avoid a hard dependency on the external service file
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

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quote.html',
  styleUrls: ['./quote.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteComponent {

  private readonly apiUrl = 'https://localhost:7257/api/quotes';

  formData: QuoteRequest = {
    age: 30,
    gender: 'Male',
    city: 'Delhi',
    sumInsured: 500000,
    policyTerm: 1
  };
  plans = signal<QuotePlan[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  getQuote(): void {
    if (!this.validateFormData()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.plans.set([]);

    console.log('Request:', this.formData);

    this.http.post<QuoteResponse>(this.apiUrl, this.formData).subscribe({
      next: (res) => {
        console.log('Response:', res);
        this.plans.set(res.plans ?? []);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.errorMessage.set('Failed to fetch quotes. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  private validateFormData(): boolean {
    if (this.formData.age < 18 || this.formData.age > 70) {
      this.errorMessage.set('Age must be between 18 and 70.');
      return false;
    }
    if (this.formData.sumInsured < 300000) {
      this.errorMessage.set('Minimum sum insured is ₹3 Lakh.');
      return false;
    }
    return true;
  }
}