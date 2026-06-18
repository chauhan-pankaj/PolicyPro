import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginModalComponent {
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() otpLogin = new EventEmitter<string>();
  @Output() whatsappLogin = new EventEmitter<string>();
  @Output() googleLogin = new EventEmitter<void>();

  loginForm: FormGroup;
  isLoading = signal(false);
  showValidation = signal(false);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/)
        ]
      ]
    });
  }

  get mobileNumberControl(): FormControl {
    return this.loginForm.get('mobileNumber') as FormControl;
  }

  // Allow only digits in mobile input
  onlyDigits(event: any): void {
    const value = event.target.value;
    const sanitized = value.replace(/[^0-9]/g, '');
    
    if (value !== sanitized) {
      event.target.value = sanitized.substring(0, 10);
      this.mobileNumberControl.setValue(sanitized.substring(0, 10), { emitEvent: false });
    }
  }

  onSignInWithOTP(): void {
    this.showValidation.set(true);

    if (this.loginForm.invalid) {
      this.mobileNumberControl.markAsTouched();
      return;
    }

    this.isLoading.set(true);
    const mobileNumber = this.loginForm.get('mobileNumber')?.value;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.otpLogin.emit(mobileNumber);
      this.resetForm();
    }, 1500);
  }

  onSignInWithWhatsApp(): void {
    this.showValidation.set(true);

    if (this.loginForm.invalid) {
      this.mobileNumberControl.markAsTouched();
      return;
    }

    const mobileNumber = this.loginForm.get('mobileNumber')?.value;
    this.whatsappLogin.emit(mobileNumber);
    this.resetForm();
  }

  onSignInWithGoogle(): void {
    this.googleLogin.emit();
    this.resetForm();
  }

  onClose(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.loginForm.reset();
    this.showValidation.set(false);
    this.isLoading.set(false);
  }
}
