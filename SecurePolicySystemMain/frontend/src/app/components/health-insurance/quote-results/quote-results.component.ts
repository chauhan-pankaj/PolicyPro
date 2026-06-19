import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HealthInsuranceService } from '../../../services/health-insurance.service';
import { QuotePlan } from '../../../services/quote.service';

interface InsurancePlan {
  id: number;
  logo: string;
  name: string;
  premium: number;
  hospitals: number;
  claimRatio: number;
  sumInsured: number;
}

@Component({
  selector: 'app-quote-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-results.component.html',
  styleUrls: ['./quote-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteResultsComponent {
  selectedSumInsured = signal(5);
  selectedInsurer = signal('');
  selectedFamilyType = signal('');

  sumInsuredOptions = [3, 5, 7, 10, 15];
  insurerOptions = ['HDFC', 'Star Health', 'Aditya Birla', 'Niva Bupa'];
  familyTypeOptions = ['Individual', 'Family of 2', 'Family of 3', 'Family of 4+'];

  // Pull data from service
  isLoading = computed(() => this.healthService.isLoadingQuotes());
  quoteError = computed(() => this.healthService.quoteError());
  quoteResponse = computed(() => this.healthService.quoteResponse());

  // Map API plans to display format, fallback to mock if no API response
  plans = computed<InsurancePlan[]>(() => {
    const response = this.healthService.quoteResponse();
    if (response && response.plans && response.plans.length > 0) {
      return response.plans.map((plan: QuotePlan, index: number) => ({
        id: index + 1,
        logo: plan.planName.split(' ')[0],
        name: plan.planName,
        premium: plan.premium,
        hospitals: (plan.features || []).length > 0
          ? this.parseHospitals(plan.features)
          : 9000,
        claimRatio: 93.0,
        sumInsured: (plan.coverage || 500000) / 100000
      }));
    }
    // Fallback mock data
    return [
      { id: 1, logo: 'HDFC', name: 'HDFC Ergo Optima Secure', premium: 4500, hospitals: 9500, claimRatio: 95.2, sumInsured: 5 },
      { id: 2, logo: 'Star Health', name: 'Star Health Comprehensive', premium: 4200, hospitals: 8500, claimRatio: 92.5, sumInsured: 5 },
      { id: 3, logo: 'Aditya Birla', name: 'Aditya Birla Active Care', premium: 3800, hospitals: 7200, claimRatio: 91.0, sumInsured: 5 },
      { id: 4, logo: 'Niva Bupa', name: 'Niva Bupa Health Companion', premium: 5100, hospitals: 10500, claimRatio: 96.8, sumInsured: 5 },
      { id: 5, logo: 'HDFC', name: 'HDFC Ergo Prime', premium: 5500, hospitals: 9800, claimRatio: 94.3, sumInsured: 5 },
      { id: 6, logo: 'Star Health', name: 'Star Comprehensive Plus', premium: 4800, hospitals: 9200, claimRatio: 93.8, sumInsured: 5 }
    ];
  });

  constructor(
    private healthService: HealthInsuranceService,
    private router: Router
  ) {}

  private parseHospitals(features: string[]): number {
    const hospitalFeature = features.find(f => f.toLowerCase().includes('hospital'));
    if (hospitalFeature) {
      const match = hospitalFeature.match(/\d+/);
      if (match) return parseInt(match[0]);
    }
    return 9000;
  }

  get journeyData$() {
    return this.healthService.journeyData();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  onFilterChange(type: string, value: any): void {
    if (type === 'sumInsured') {
      this.selectedSumInsured.set(value);
    } else if (type === 'insurer') {
      this.selectedInsurer.set(value);
    } else if (type === 'familyType') {
      this.selectedFamilyType.set(value);
    }
  }

  buyNow(planId: number): void {
    alert(`Plan ${planId} selected! Redirecting to checkout...`);
  }

  formatPremium(premium: number): string {
    return `₹${premium.toLocaleString()}`;
  }
}
