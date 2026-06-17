import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { SelectModule } from 'primeng/select';

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
    SelectModule
  ],
  templateUrl: './quote.html',
  styleUrls: ['./quote.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteComponent {
  quoteForm: FormGroup;
  isSubmitted = false;

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

    // Replace this with actual API call
    // this.quoteService.getPlans(payload).subscribe(...)

    alert('Plans fetched successfully!');
  }
}