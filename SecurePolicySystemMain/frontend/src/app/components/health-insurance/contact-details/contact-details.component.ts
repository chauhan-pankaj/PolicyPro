import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthInsuranceService, ContactDetails } from '../../../services/health-insurance.service';
import { QuoteService, QuoteRequest, QuoteMember } from '../../../services/quote.service';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactDetailsComponent {
  fullName = signal('');
  mobileNumber = signal('');
  pincode = signal('');
  email = signal('');
  touched = signal({ fullName: false, mobile: false, pincode: false, email: false });

  isLoading = signal(false);
  errorMsg = signal<string | null>(null);

  constructor(private healthService: HealthInsuranceService, private quoteService: QuoteService) {
    const existing = this.healthService.journeyData().contactDetails;
    if (existing) {
      this.fullName.set(existing.fullName);
      this.mobileNumber.set(existing.mobileNumber);
      this.pincode.set(existing.pincode);
      this.email.set(existing.email);
    }
  }

  onlyDigits(event: any, field: 'mobile' | 'pincode'): void {
    const value = event.target.value;
    const sanitized = value.replace(/[^0-9]/g, '');
    const maxLength = field === 'mobile' ? 10 : 6;

    if (value !== sanitized || sanitized.length > maxLength) {
      event.target.value = sanitized.substring(0, maxLength);
      if (field === 'mobile') {
        this.mobileNumber.set(sanitized.substring(0, maxLength));
      } else {
        this.pincode.set(sanitized.substring(0, maxLength));
      }
    }
  }

  markTouched(field: string): void {
    this.touched.update((t) => ({ ...t, [field]: true }));
  }

  isFieldValid(field: string): boolean {
    let val = '';
    if (field === 'fullName') val = this.fullName();
    else if (field === 'mobile') val = this.mobileNumber();
    else if (field === 'pincode') val = this.pincode();
    else if (field === 'email') val = this.email();

    if (field === 'fullName') return val.length >= 3;
    if (field === 'mobile') return /^[6-9]\d{9}$/.test(val);
    if (field === 'pincode') return /^\d{6}$/.test(val);
    if (field === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    return false;
  }

  canContinue(): boolean {
    return (
      this.isFieldValid('fullName') &&
      this.isFieldValid('mobile') &&
      this.isFieldValid('pincode') &&
      this.isFieldValid('email')
    );
  }

  private buildQuotePayload(details: ContactDetails): QuoteRequest {
    const journey = this.healthService.journeyData();
    const members: QuoteMember[] = [];

    journey.selectedMembers.forEach(member => {
      const memberAges = journey.memberAges.filter(a => a.type.startsWith(member.type));

      if (memberAges.length > 0) {
        memberAges.forEach(ageEntry => {
          const relation = this.mapMemberRelation(member.type);
          members.push({
            relation,
            age: ageEntry.age ?? 25,
            gender: member.type === 'self'
              ? (journey.gender === 'female' ? 'FEMALE' : 'MALE')
              : member.type === 'spouse'
                ? (journey.gender === 'female' ? 'MALE' : 'FEMALE')
                : member.type === 'daughter' ? 'FEMALE' : 'MALE'
          });
        });
      } else {
        members.push({
          relation: this.mapMemberRelation(member.type),
          age: 25,
          gender: member.type === 'daughter' ? 'FEMALE' : 'MALE'
        });
      }
    });

    const hasSelf = journey.selectedMembers.some(m => m.type === 'self');
    const hasFamily = journey.selectedMembers.some(m => m.type === 'spouse' || m.type === 'son' || m.type === 'daughter');
    const planType = !hasFamily ? 'INDIVIDUAL' : 'FAMILY';

    return {
      quoteType: planType,
      members,
      cityId: 2,
      sumInsured: 500000,
      policyTerm: 1,
      planType
    };
  }

  private mapMemberRelation(type: string): 'SELF' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' {
    switch (type) {
      case 'self':     return 'SELF';
      case 'spouse':   return 'SPOUSE';
      case 'son':
      case 'daughter': return 'CHILD';
      case 'father':
      case 'mother':   return 'PARENT';
      default:         return 'SELF';
    }
  }

  continue(): void {
    if (!this.canContinue()) {
      this.markTouched('fullName');
      this.markTouched('mobile');
      this.markTouched('pincode');
      this.markTouched('email');
      return;
    }

    const details: ContactDetails = {
      fullName: this.fullName(),
      mobileNumber: this.mobileNumber(),
      pincode: this.pincode(),
      email: this.email()
    };

    this.healthService.setContactDetails(details);
    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.healthService.setLoadingQuotes(true);

    const payload = this.buildQuotePayload(details);
    console.log('📦 Quote API Payload:', JSON.stringify(payload, null, 2));

    this.quoteService.getQuotes(payload).subscribe({
      next: (response) => {
        console.log('✅ Quote API Response:', response);
        this.healthService.setQuoteResponse(response);
        this.healthService.setLoadingQuotes(false);
        this.isLoading.set(false);
        this.healthService.nextStep();
      },
      error: (error: any) => {
        console.error('❌ Quote API Error:', error);
        this.healthService.setQuoteError(error.message || 'Failed to fetch quotes');
        this.healthService.setLoadingQuotes(false);
        this.isLoading.set(false);
        // Still navigate to step 4 so user sees results (with error state)
        this.healthService.nextStep();
      }
    });
  }
}
