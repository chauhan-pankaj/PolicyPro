import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HealthInsuranceService, ContactDetails } from '../../../services/health-insurance.service';

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

  constructor(private healthService: HealthInsuranceService) {
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

  continue(): void {
    if (this.canContinue()) {
      const details: ContactDetails = {
        fullName: this.fullName(),
        mobileNumber: this.mobileNumber(),
        pincode: this.pincode(),
        email: this.email()
      };
      this.healthService.setContactDetails(details);
      this.healthService.nextStep();
    }
  }
}
