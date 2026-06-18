import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HealthInsuranceService } from '../../../services/health-insurance.service';

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

  plans = signal<InsurancePlan[]>([
    {
      id: 1,
      logo: 'HDFC',
      name: 'HDFC Ergo Optima Secure',
      premium: 4500,
      hospitals: 9500,
      claimRatio: 95.2,
      sumInsured: 5
    },
    {
      id: 2,
      logo: 'Star Health',
      name: 'Star Health Comprehensive',
      premium: 4200,
      hospitals: 8500,
      claimRatio: 92.5,
      sumInsured: 5
    },
    {
      id: 3,
      logo: 'Aditya Birla',
      name: 'Aditya Birla Active Care',
      premium: 3800,
      hospitals: 7200,
      claimRatio: 91.0,
      sumInsured: 5
    },
    {
      id: 4,
      logo: 'Niva Bupa',
      name: 'Niva Bupa Health Companion',
      premium: 5100,
      hospitals: 10500,
      claimRatio: 96.8,
      sumInsured: 5
    },
    {
      id: 5,
      logo: 'HDFC',
      name: 'HDFC Ergo Prime',
      premium: 5500,
      hospitals: 9800,
      claimRatio: 94.3,
      sumInsured: 5
    },
    {
      id: 6,
      logo: 'Star Health',
      name: 'Star Comprehensive Plus',
      premium: 4800,
      hospitals: 9200,
      claimRatio: 93.8,
      sumInsured: 5
    }
  ]);

  constructor(
    private healthService: HealthInsuranceService,
    private router: Router
  ) {}

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
