import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthInsuranceService } from '../../../services/health-insurance.service';

@Component({
  selector: 'app-member-age',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-age.component.html',
  styleUrls: ['./member-age.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberAgeComponent {
  memberLabels: string[] = [];

  constructor(private healthService: HealthInsuranceService) {
    this.memberLabels = this.healthService.getDynamicMemberLabels();
  }

  get journeyData$() {
    return this.healthService.journeyData();
  }

  getMemberAge(index: number): number | null {
    const memberType = this.getAgeFieldType(index);
    const age = this.healthService.journeyData().memberAges.find((m) => m.type === memberType);
    return age?.age ?? null;
  }

  getAgeFieldType(index: number): string {
    const labels = this.healthService.getDynamicMemberLabels();
    if (index === 0) return 'self';
    if (labels[index]?.includes('Wife')) return 'wife';
    if (labels[index]?.includes('Father')) return 'father';
    if (labels[index]?.includes('Mother')) return 'mother';
    if (labels[index]?.includes('Son')) return `son_${index}`;
    if (labels[index]?.includes('Daughter')) return `daughter_${index}`;
    return `member_${index}`;
  }

  setAge(index: number, age: number): void {
    const memberType = this.getAgeFieldType(index);
    this.healthService.setMemberAge(memberType, age);
  }

  canContinue(): boolean {
    return this.healthService.isMemberAgesComplete();
  }

  continue(): void {
    if (this.canContinue()) {
      this.healthService.nextStep();
    }
  }

  getAges(): number[] {
    return Array.from({ length: 101 }, (_, i) => i);
  }
}
