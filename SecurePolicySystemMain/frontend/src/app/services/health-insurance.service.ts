import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { QuoteResponse } from './quote.service';

export interface SelectedMember {
  type: 'self' | 'spouse' | 'son' | 'daughter' | 'father' | 'mother';
  label: string;
  quantity?: number;
}

export interface MemberAge {
  type: string;
  age: number | null;
}

export interface ContactDetails {
  fullName: string;
  mobileNumber: string;
  pincode: string;
  email: string;
}

export interface HealthInsuranceJourney {
  gender: 'male' | 'female' | null;
  selectedMembers: SelectedMember[];
  memberAges: MemberAge[];
  contactDetails: ContactDetails | null;
}

@Injectable({
  providedIn: 'root'
})
export class HealthInsuranceService {
  journeyData = signal<HealthInsuranceJourney>({
    gender: null,
    selectedMembers: [],
    memberAges: [],
    contactDetails: null
  });

  currentStep = signal<1 | 2 | 3 | 4>(1);

  // Quote API response state
  quoteResponse = signal<QuoteResponse | null>(null);
  isLoadingQuotes = signal<boolean>(false);
  quoteError = signal<string | null>(null);

  setQuoteResponse(response: QuoteResponse): void {
    this.quoteResponse.set(response);
  }

  setQuoteError(error: string | null): void {
    this.quoteError.set(error);
  }

  setLoadingQuotes(loading: boolean): void {
    this.isLoadingQuotes.set(loading);
  }

  // Member selection methods
  setGender(gender: 'male' | 'female'): void {
    this.journeyData.update((data) => ({
      ...data,
      gender
    }));
  }

  toggleMember(memberType: 'self' | 'spouse' | 'son' | 'daughter' | 'father' | 'mother', label: string): void {
    this.journeyData.update((data) => {
      const exists = data.selectedMembers.some((m) => m.type === memberType);

      if (exists) {
        return {
          ...data,
          selectedMembers: data.selectedMembers.filter((m) => m.type !== memberType),
          memberAges: data.memberAges.filter((m) => !m.type.startsWith(memberType))
        };
      } else {
        const newMember: SelectedMember = { type: memberType, label, quantity: 1 };
        return {
          ...data,
          selectedMembers: [...data.selectedMembers, newMember]
        };
      }
    });
  }

  setMemberQuantity(memberType: 'son' | 'daughter', quantity: number): void {
    this.journeyData.update((data) => {
      const updated = data.selectedMembers.map((m) =>
        m.type === memberType ? { ...m, quantity } : m
      );

      return {
        ...data,
        selectedMembers: updated
      };
    });
  }

  // Member age methods
  setMemberAge(memberType: string, age: number): void {
    this.journeyData.update((data) => {
      const exists = data.memberAges.find((m) => m.type === memberType);

      if (exists) {
        return {
          ...data,
          memberAges: data.memberAges.map((m) =>
            m.type === memberType ? { ...m, age } : m
          )
        };
      } else {
        return {
          ...data,
          memberAges: [...data.memberAges, { type: memberType, age }]
        };
      }
    });
  }

  // Contact details methods
  setContactDetails(details: ContactDetails): void {
    this.journeyData.update((data) => ({
      ...data,
      contactDetails: details
    }));
  }

  // Step navigation
  nextStep(): void {
    this.currentStep.update((step) => (step < 4 ? (step + 1) as 1 | 2 | 3 | 4 : step));
  }

  previousStep(): void {
    this.currentStep.update((step) => (step > 1 ? (step - 1) as 1 | 2 | 3 | 4 : step));
  }

  setStep(step: 1 | 2 | 3 | 4): void {
    this.currentStep.set(step);
  }

  // Reset journey
  resetJourney(): void {
    this.journeyData.set({
      gender: null,
      selectedMembers: [],
      memberAges: [],
      contactDetails: null
    });
    this.currentStep.set(1);
  }

  // Get dynamic member age labels
  getDynamicMemberLabels(): string[] {
    const data = this.journeyData();
    const labels: string[] = [];

    data.selectedMembers.forEach((member) => {
      if (member.type === 'self') {
        labels.push('Your Age');
      } else if (member.type === 'spouse') {
        labels.push(member.label + ' Age');
      } else if (member.type === 'father') {
        labels.push('Father Age');
      } else if (member.type === 'mother') {
        labels.push('Mother Age');
      } else if (member.type === 'son' && member.quantity) {
        for (let i = 1; i <= member.quantity; i++) {
          labels.push(`${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Son Age`);
        }
      } else if (member.type === 'daughter' && member.quantity) {
        for (let i = 1; i <= member.quantity; i++) {
          labels.push(`${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Daughter Age`);
        }
      }
    });

    return labels;
  }

  // Validation helpers
  isMemberSelectionComplete(): boolean {
    return this.journeyData().selectedMembers.length > 0;
  }

  isMemberAgesComplete(): boolean {
    const data = this.journeyData();
    const labels = this.getDynamicMemberLabels();
    return labels.length === data.memberAges.length && data.memberAges.every((m) => m.age !== null && m.age >= 0);
  }

  isContactDetailsComplete(): boolean {
    const details = this.journeyData().contactDetails;
    return (
      details !== null &&
      details.fullName.length >= 3 &&
      /^[6-9]\d{9}$/.test(details.mobileNumber) &&
      /^\d{6}$/.test(details.pincode) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)
    );
  }
}
