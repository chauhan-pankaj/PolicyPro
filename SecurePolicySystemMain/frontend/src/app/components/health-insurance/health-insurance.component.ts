import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HealthInsuranceService } from '../../services/health-insurance.service';
import { TranslationService, LanguageCode } from '../../services/translation.service';
import { MemberSelectionComponent } from './member-selection/member-selection.component';
import { MemberAgeComponent } from './member-age/member-age.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { QuoteResultsComponent } from './quote-results/quote-results.component';

@Component({
  selector: 'app-health-insurance',
  standalone: true,
  imports: [
    CommonModule,
    MemberSelectionComponent,
    MemberAgeComponent,
    ContactDetailsComponent,
    QuoteResultsComponent
  ],
  templateUrl: './health-insurance.component.html',
  styleUrls: ['./health-insurance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HealthInsuranceComponent {
  get languages() {
    return this.translationService.languages;
  }

  constructor(
    private healthService: HealthInsuranceService,
    private router: Router,
    public translationService: TranslationService
  ) {
    // Initialize to step 1
    this.healthService.setStep(1);
  }

  get currentStep$() {
    return this.healthService.currentStep;
  }

  get selectedLanguage() {
    return this.translationService.currentLanguage;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  changeLanguage(language: string): void {
    this.translationService.setLanguage(language as LanguageCode);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  handleBackClick(): void {
    if (this.healthService.currentStep() === 1) {
      this.router.navigate(['/']);
    } else {
      this.healthService.previousStep();
    }
  }
}
