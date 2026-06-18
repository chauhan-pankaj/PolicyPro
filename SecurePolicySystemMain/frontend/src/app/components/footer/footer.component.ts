import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InsurancePartner {
  name: string;
  shortName: string;
  fullName: string;
  logo?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  insurancePartners: InsurancePartner[] = [
    { name: 'HDFC', shortName: 'HDFC', fullName: 'HDFC Ergo' },
    { name: 'ICICI', shortName: 'ICICI', fullName: 'ICICI Lombard' },
    { name: 'BUPA', shortName: 'BUPA', fullName: 'Niva Bupa' },
    { name: 'STAR', shortName: 'STAR', fullName: 'Star Health' },
    { name: 'CARE', shortName: 'CARE', fullName: 'Care Health' },
    { name: 'BAJAJ', shortName: 'BAJAJ', fullName: 'Bajaj Allianz' },
    { name: 'TATA', shortName: 'TATA', fullName: 'TATA AIG' },
    { name: 'ADITYA', shortName: 'ADITYA', fullName: 'Aditya Birla', logo: 'assets/Aditya_Birla@2x.avif' },
    { name: 'DIGIT', shortName: 'DIGIT', fullName: 'Digit Insurance' },
    { name: 'MAX', shortName: 'MAX', fullName: 'Max Bupa' },
    { name: 'APOLLO', shortName: 'APOLLO', fullName: 'Apollo Munich' },
    { name: 'RELIGARE', shortName: 'RELIGARE', fullName: 'Religare' },
    { name: 'UNITED', shortName: 'UNITED', fullName: 'United India' },
    { name: 'NEWINDIA', shortName: 'NEWINDIA', fullName: 'New India' },
    { name: 'ORIENTAL', shortName: 'ORIENTAL', fullName: 'Oriental' },
    { name: 'NATIONAL', shortName: 'NATIONAL', fullName: 'National' },
    { name: 'KOTAK', shortName: 'KOTAK', fullName: 'Kotak Mahindra' },
    { name: 'EDELWEISS', shortName: 'EDELWEISS', fullName: 'Edelweiss' },
    { name: 'PRUDENTIAL', shortName: 'PRUDENTIAL', fullName: 'ICICI Prudential' },
    { name: 'LIC', shortName: 'LIC', fullName: 'LIC', logo: 'assets/lic-life-insurance-old.avif' }
  ];
}
