import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { QuoteService, QuoteRequest, QuoteMember } from '../../services/quote.service';

interface DropdownOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    LoginModalComponent
  ],
  templateUrl: './quote.html',
  styleUrls: ['./quote.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteComponent {
  quoteForm: FormGroup;
  showLoginModal = signal(false);
  isSubmitted = signal(false);
  
  // Loading and response states
  isLoading = signal(false);
  quoteResponse = signal<any>(null);
  errorMessage = signal<string | null>(null);
  showSuccessMessage = signal(false);

  coverOptions: DropdownOption[] = [
    { label: 'Self Only', value: 'INDIVIDUAL' },
    { label: 'Self + Spouse', value: 'FAMILY' },
    { label: 'Family', value: 'GROUP' }
  ];

  sumInsuredOptions: DropdownOption[] = [
    { label: '₹3 Lakh', value: 300000 },
    { label: '₹5 Lakh', value: 500000 },
    { label: '₹10 Lakh', value: 1000000 },
    { label: '₹20 Lakh', value: 2000000 }
  ];

  policyTermOptions: DropdownOption[] = [
    { label: '1 Year', value: 1 },
    { label: '5 Years', value: 5 },
    { label: '10 Years', value: 10 },
    { label: '20 Years', value: 20 },
    { label: '30 Years', value: 30 }
  ];

  constructor(private fb: FormBuilder, private quoteService: QuoteService) {
    this.quoteForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/)
        ]
      ],
      dob: [
        '',
        Validators.required
      ],
      coverFor: [
        null,
        Validators.required
      ],
      pincode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{6}$/)
        ]
      ],
      sumInsured: [
        null,
        Validators.required
      ],
      policyTerm: [
        1,
        Validators.required
      ],
      couponCode: ['']
    });
  }

  get controls() {
    return this.quoteForm.controls;
  }

  // FormControl getters for easier access in template
  get fullNameControl(): FormControl {
    return this.quoteForm.get('fullName') as FormControl;
  }

  get mobileControl(): FormControl {
    return this.quoteForm.get('mobile') as FormControl;
  }

  get dobControl(): FormControl {
    return this.quoteForm.get('dob') as FormControl;
  }

  get coverForControl(): FormControl {
    return this.quoteForm.get('coverFor') as FormControl;
  }

  get pincodeControl(): FormControl {
    return this.quoteForm.get('pincode') as FormControl;
  }

  get sumInsuredControl(): FormControl {
    return this.quoteForm.get('sumInsured') as FormControl;
  }

  get policyTermControl(): FormControl {
    return this.quoteForm.get('policyTerm') as FormControl;
  }

  get couponCodeControl(): FormControl {
    return this.quoteForm.get('couponCode') as FormControl;
  }

  // Allow only digits in input field
  onlyDigits(event: any): void {
    const value = event.target.value;
    const sanitized = value.replace(/[^0-9]/g, '');
    
    if (value !== sanitized) {
      event.target.value = sanitized;
      // Update form control value
      const controlName = event.target.getAttribute('formControlName');
      if (controlName) {
        this.quoteForm.get(controlName)?.setValue(sanitized, { emitEvent: false });
      }
    }
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Get city ID from pincode (mock implementation - should call backend)
   */
  private getCityIdFromPincode(pincode: string): number {
    // Mock implementation - in production, call an API to get city ID
    return 2; // Default to city ID 2
  }

  /**
   * Build QuoteRequest payload from form data
   */
  private buildQuoteRequest(): QuoteRequest {
    const formData = this.quoteForm.value;
    const age = this.calculateAge(formData.dob);
    const cityId = this.getCityIdFromPincode(formData.pincode);

    // Build member based on cover type
    const members: QuoteMember[] = [];
    
    if (formData.coverFor === 'INDIVIDUAL') {
      members.push({
        relation: 'SELF',
        age: age,
        gender: 'MALE' // Can be extended to capture gender from form
      });
    } else if (formData.coverFor === 'FAMILY') {
      members.push({
        relation: 'SELF',
        age: age,
        gender: 'MALE'
      });
      members.push({
        relation: 'SPOUSE',
        age: age + 2, // Placeholder - should capture spouse age
        gender: 'FEMALE'
      });
    } else if (formData.coverFor === 'GROUP') {
      // For group, add multiple members
      members.push({
        relation: 'SELF',
        age: age,
        gender: 'MALE'
      });
    }

    return {
      quoteType: formData.coverFor || 'INDIVIDUAL',
      members: members,
      cityId: cityId,
      sumInsured: formData.sumInsured,
      policyTerm: formData.policyTerm || 1,
      planType: formData.coverFor || 'INDIVIDUAL',
      couponCode: formData.couponCode || undefined
    };
  }

  getQuote(): void {
    console.log('=== QUOTE FORM SUBMISSION STARTED ===');
    console.log('Form Valid:', this.quoteForm.valid);
    console.log('Form Value:', this.quoteForm.value);
    
    this.isSubmitted.set(true);

    if (this.quoteForm.invalid) {
      console.error('❌ Form is INVALID. Errors:');
      Object.keys(this.quoteForm.controls).forEach(key => {
        const control = this.quoteForm.get(key);
        if (control && control.invalid) {
          console.error(`   - ${key}:`, control.errors);
        }
      });
      this.quoteForm.markAllAsTouched();
      this.errorMessage.set('Please fill all required fields correctly');
      return;
    }

    console.log('✅ Form is VALID');
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.quoteResponse.set(null);

    const quoteRequest = this.buildQuoteRequest();
    
    console.log('📦 Quote Request Payload:', JSON.stringify(quoteRequest, null, 2));

    const apiEndpoint = `${this.quoteService['apiUrl']}`;
    console.log('🌐 API Endpoint:', apiEndpoint);

    this.quoteService.getQuotes(quoteRequest).subscribe({
      next: (response: any) => {
        console.log('✅ API CALL SUCCESSFUL');
        console.log('📨 Quote Response:', response);
        this.isLoading.set(false);
        this.quoteResponse.set(response);
        this.showSuccessMessage.set(true);
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccessMessage.set(false);
        }, 5000);
      },
      error: (error: any) => {
        console.error('❌ API CALL FAILED');
        console.error('Error Status:', error.status);
        console.error('Error Message:', error.message);
        console.error('Full Error:', error);
        
        this.isLoading.set(false);
        const errorMsg = error.error?.message || error.message || 'Failed to fetch quotes';
        this.errorMessage.set(errorMsg);
        console.error('Quote Error:', error);
      }
    });
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.errorMessage.set(null);
  }

  /**
   * Reset form and close success message
   */
  resetForm(): void {
    this.quoteForm.reset({ policyTerm: 1 });
    this.isSubmitted.set(false);
    this.showSuccessMessage.set(false);
    this.quoteResponse.set(null);
    this.errorMessage.set(null);
  }

  // Login Modal Handlers
  openLoginModal(): void {
    this.showLoginModal.set(true);
  }

  closeLoginModal(): void {
    this.showLoginModal.set(false);
  }

  handleOTPLogin(mobileNumber: string): void {
    console.log('OTP Login with mobile:', mobileNumber);
    // TODO: Implement OTP login API call
    alert(`OTP sent to ${mobileNumber}`);
    this.closeLoginModal();
  }

  handleWhatsAppLogin(mobileNumber: string): void {
    console.log('WhatsApp Login with mobile:', mobileNumber);
    // TODO: Implement WhatsApp login API call
    alert(`WhatsApp login initiated for ${mobileNumber}`);
    this.closeLoginModal();
  }

  handleGoogleLogin(): void {
    console.log('Google Login initiated');
    // TODO: Implement Google login API call
    alert('Google login initiated');
    this.closeLoginModal();
  }
}