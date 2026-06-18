import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthInsuranceService, SelectedMember } from '../../../services/health-insurance.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-member-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-selection.component.html',
  styleUrls: ['./member-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberSelectionComponent {
  constructor(
    private healthService: HealthInsuranceService,
    public translationService: TranslationService
  ) {}

  get gender$() {
    return this.healthService.journeyData();
  }

  get selectedMembers$() {
    return this.healthService.journeyData();
  }

  get members(): SelectedMember[] {
    const gender = this.healthService.journeyData().gender;
    const baseMembers: SelectedMember[] = [
      { type: 'self', label: 'Self' }
    ];

    // Add spouse based on gender
    if (gender === 'male') {
      baseMembers.push({ type: 'spouse', label: 'Wife' });
    } else if (gender === 'female') {
      baseMembers.push({ type: 'spouse', label: 'Husband' });
    }

    // Add children
    baseMembers.push(
      { type: 'son', label: 'Son' },
      { type: 'daughter', label: 'Daughter' }
    );

    // Add parents
    baseMembers.push(
      { type: 'father', label: 'Father' },
      { type: 'mother', label: 'Mother' }
    );

    return baseMembers;
  }

  selectGender(gender: 'male' | 'female'): void {
    this.healthService.setGender(gender);
  }

  toggleMember(member: SelectedMember): void {
    this.healthService.toggleMember(member.type, member.label);
  }

  isMemberSelected(memberType: string): boolean {
    return this.healthService.journeyData().selectedMembers.some((m) => m.type === memberType);
  }

  getSonQuantity(): number {
    const member = this.healthService.journeyData().selectedMembers.find((m) => m.type === 'son');
    return member?.quantity || 1;
  }

  getDaughterQuantity(): number {
    const member = this.healthService.journeyData().selectedMembers.find((m) => m.type === 'daughter');
    return member?.quantity || 1;
  }

  updateSonQuantity(change: number): void {
    const current = this.getSonQuantity();
    const newQty = Math.max(1, Math.min(4, current + change));
    this.healthService.setMemberQuantity('son', newQty);
  }

  updateDaughterQuantity(change: number): void {
    const current = this.getDaughterQuantity();
    const newQty = Math.max(1, Math.min(4, current + change));
    this.healthService.setMemberQuantity('daughter', newQty);
  }

  canContinue(): boolean {
    return this.healthService.isMemberSelectionComplete();
  }

  continue(): void {
    if (this.canContinue()) {
      this.healthService.nextStep();
    }
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
