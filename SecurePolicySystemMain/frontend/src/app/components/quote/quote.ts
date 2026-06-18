import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
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
  isSubmitted = false;
  showSuccessMessage = false;

  coverOptions: DropdownOption[] = [
    { label: 'Self Only', value: 'self' },
    { label: 'Self + Spouse', value: 'family' },
    { label: 'Family', value: 'full-family' }
  ];

  sumInsuredOptions: DropdownOption[] = [
    { label: '₹3 Lakh', value: 300000 },
    { label: '₹5 Lakh', value: 500000 },
    { label: '₹10 Lakh', value: 1000000 },
    { label: '₹20 Lakh', value: 2000000 }
  ];

  constructor(private fb: FormBuilder) {
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
      ]
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

  getQuote(): void {
    this.isSubmitted = true;

    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.quoteForm.value
    };

    console.log('Quote Request Payload:', payload);
    
    // Show success message
    this.showSuccessMessage = true;
    
    // Reset form and message after 3 seconds
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.isSubmitted = false;
      this.quoteForm.reset();
    }, 3000);

    // Replace this with actual API call
    // this.quoteService.getPlans(payload).subscribe(
    //   (response) => {
    //     this.showSuccessMessage = true;
    //     // Handle response
    //   },
    //   (error) => {
    //     console.error('Error fetching plans:', error);
    //     this.isSubmitted = false;
    //   }
    // );
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