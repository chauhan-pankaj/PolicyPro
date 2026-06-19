import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl
} from '@angular/forms';
import { environment } from '../../../environments/environment';

// Declare google global from GIS SDK
declare const google: any;

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnChanges, OnInit {
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() otpLogin = new EventEmitter<string>();
  @Output() whatsappLogin = new EventEmitter<string>();
  @Output() googleLogin = new EventEmitter<any>();

  loginForm: FormGroup;
  isLoading = signal(false);
  showValidation = signal(false);
  isGoogleLoading = signal(false);

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
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

  ngOnInit(): void {
    // Google GIS is loaded via script tag in index.html
  }

  get mobileNumberControl(): FormControl {
    return this.loginForm.get('mobileNumber') as FormControl;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']) {
      this.cdr.markForCheck();
      if (!changes['isVisible'].currentValue) {
        this.resetForm();
      }
    }
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
    if (this.isGoogleLoading()) return;

    this.isGoogleLoading.set(true);
    this.cdr.markForCheck();

    try {
      if (typeof google !== 'undefined' && google.accounts) {
        // Use Google Identity Services popup flow
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleGoogleResponse(response),
          ux_mode: 'popup',
          context: 'signin'
        });

        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to OAuth2 popup if One Tap not available
            this.openGoogleOAuthPopup();
          }
          this.isGoogleLoading.set(false);
          this.cdr.markForCheck();
        });
      } else {
        // GIS library not loaded yet — fallback to OAuth2 popup
        this.openGoogleOAuthPopup();
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      this.openGoogleOAuthPopup();
    }
  }

  private openGoogleOAuthPopup(): void {
    const clientId = environment.googleClientId;
    const redirectUri = encodeURIComponent(window.location.origin);
    const scope = encodeURIComponent('openid email profile');
    const responseType = 'token id_token';

    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=${encodeURIComponent(responseType)}` +
      `&scope=${scope}` +
      `&prompt=select_account` +
      `&display=popup`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      googleAuthUrl,
      'Google Sign In',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      alert('Popup blocked! Please allow popups for this site.');
      this.isGoogleLoading.set(false);
      this.cdr.markForCheck();
      return;
    }

    // Listen for popup close or redirect
    const timer = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(timer);
          this.isGoogleLoading.set(false);
          this.cdr.markForCheck();
        }
      } catch {
        clearInterval(timer);
        this.isGoogleLoading.set(false);
        this.cdr.markForCheck();
      }
    }, 500);
  }

  private handleGoogleResponse(response: any): void {
    console.log('✅ Google Sign-In Success:', response);
    this.isGoogleLoading.set(false);
    this.cdr.markForCheck();
    this.googleLogin.emit(response);
    this.onClose();
  }

  onClose(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.loginForm.reset();
    this.showValidation.set(false);
    this.isLoading.set(false);
    this.isGoogleLoading.set(false);
  }
}
