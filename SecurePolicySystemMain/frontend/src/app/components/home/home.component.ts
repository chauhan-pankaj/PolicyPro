import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginModalComponent } from '../login-modal/login-modal.component';

type Tint = 'teal' | 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'yellow';
interface InsuranceCategory { id: string; icon: string; title: string; tint: Tint; route?: string; }
interface PromoBanner { icon: string; title: string; ctaLabel: string; variant: 'mint' | 'yellow' | 'soft'; }
interface BenefitCard { icon: string; title: string; description: string; tint: Tint; }
interface CalculatorCard { icon: string; title: string; links: string[]; tint: Tint; route?: string; }
interface AdvantageItem { icon: string; title: string; tint: Tint; }
interface Testimonial { initials: string; name: string; rating: number; quote: string; }
interface TrustItem { icon: string; title: string; tint: Tint; }
interface Partner { name: string; }

@Component({
  selector: 'app-home', standalone: true,
  imports: [CommonModule, RouterLink, LoginModalComponent],
  templateUrl: './home.component.html', styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  showLoginModal = signal(false);

  categories: InsuranceCategory[] = [
    { id: 'health', icon: '🛡️', title: 'Health Insurance', tint: 'teal', route: '/health-insurance' },
    { id: 'term-life', icon: '❤️', title: 'Term Life Insurance', tint: 'red' },
    { id: 'car', icon: '🚗', title: 'Car Insurance', tint: 'blue' },
    { id: 'bike', icon: '🏍️', title: 'Bike Insurance', tint: 'green' },
    { id: 'travel', icon: '✈️', title: 'Travel Insurance', tint: 'blue' },
    { id: 'home', icon: '🏠', title: 'Home Insurance', tint: 'green' },
    { id: 'family', icon: '👨‍👩‍👧', title: 'Family Health Plans', tint: 'pink', route: '/health-insurance' },
    { id: 'accident', icon: '🏃', title: 'Personal Accident', tint: 'orange' },
    { id: 'critical', icon: '🧬', title: 'Critical Illness', tint: 'purple' },
    { id: 'senior', icon: '👴', title: 'Senior Citizen Plans', tint: 'teal' },
    { id: 'child', icon: '👶', title: 'Child Plans', tint: 'pink' },
    { id: 'savings', icon: '💎', title: 'Savings Plans', tint: 'blue' },
    { id: 'investment', icon: '📈', title: 'Investment Plans', tint: 'green' },
    { id: 'business', icon: '🏢', title: 'Business Insurance', tint: 'yellow' }
  ];

  quickActions = ['Renew Insurance', 'Check Claim Status', 'Download Policy', 'Find Nearby Hospitals', 'Tax Benefits', 'Corporate Plans', 'Compare Plans'];

  promoBanners: PromoBanner[] = [
    { icon: '🩺', title: 'Book Free Health Insurance Consultation at home', ctaLabel: 'Get Expert Advice', variant: 'mint' },
    { icon: '☂️', title: 'Get ₹1 Crore Term Life Cover starting at ₹410/month*', ctaLabel: 'View Plans', variant: 'yellow' },
    { icon: '🚙', title: 'Wide Range of Car Insurance Plans with Instant Quotes', ctaLabel: 'Compare Now', variant: 'soft' }
  ];

  benefits: BenefitCard[] = [
    { icon: '💎', title: 'Wide Choice', description: 'Compare plans from top insurers in one place.', tint: 'green' },
    { icon: '₹', title: 'Best Prices', description: 'Get the right value for your money.', tint: 'orange' },
    { icon: '🛡️', title: '100% Secure', description: 'Your data is safe and protected.', tint: 'orange' },
    { icon: '🎧', title: 'Expert Support', description: 'Talk to our advisors anytime.', tint: 'teal' }
  ];

  aiFeatures = ['Personalised plan recommendations', 'Compare and choose in minutes', 'Get expert answers to all your questions'];

  trustStrip: TrustItem[] = [
    { icon: '😊', title: '5 Crore+ Happy Customers', tint: 'orange' },
    { icon: '⭐', title: 'Top Rated App', tint: 'yellow' },
    { icon: '🎧', title: '24x7 Expert Support', tint: 'teal' },
    { icon: '📍', title: 'Trusted by India', tint: 'green' }
  ];

  calculators: CalculatorCard[] = [
    { icon: '❤️', title: 'Health Insurance Calculator', links: ['Sum Insured Calculator', 'Family Floater Calculator', 'Health Check-up Cost', 'Tax Savings Calculator'], tint: 'teal', route: '/health-insurance' },
    { icon: '☂️', title: 'Term Life Insurance Calculator', links: ['Human Life Value Calculator', 'Term Premium Calculator', 'Retirement Calculator', 'Child Education Calculator'], tint: 'green' },
    { icon: '🚗', title: 'Car Insurance Calculator', links: ['Car Premium Calculator', 'IDV Calculator', 'Zero Depreciation Calculator', 'Claim Amount Estimator'], tint: 'blue' },
    { icon: '✈️', title: 'Travel Insurance Calculator', links: ['Trip Cost Calculator', 'Coverage Calculator', 'Schengen Visa Calculator', 'Claim Process Guide'], tint: 'blue' }
  ];

  advantages: AdvantageItem[] = [
    { icon: '⚖️', title: '100% Unbiased Advice', tint: 'yellow' },
    { icon: '📝', title: 'Quick & Easy Process', tint: 'green' },
    { icon: '🏢', title: 'Wide Range of Insurers', tint: 'blue' },
    { icon: '🤝', title: 'Claims Support Made Simple', tint: 'orange' },
    { icon: '🕐', title: 'Always Here For You', tint: 'teal' }
  ];

  testimonials: Testimonial[] = [
    { initials: 'RS', name: 'Rohit Sharma', rating: 5, quote: 'Super easy to compare plans. Got the best health insurance for my family.' },
    { initials: 'PM', name: 'Priya Mehta', rating: 5, quote: 'Transparent process and amazing support. Highly recommended.' },
    { initials: 'AV', name: 'Amit Verma', rating: 5, quote: 'Renewed my car insurance in just 5 minutes. Great experience!' }
  ];

  partners: Partner[] = [
    { name: 'HDFC ERGO' }, { name: 'ICICI Lombard' }, { name: 'MAX LIFE' }, { name: 'TATA AIG' },
    { name: 'BAJAJ Allianz' }, { name: 'SBI General' }, { name: 'Go Digit' }, { name: 'ACKO' },
    { name: 'Reliance' }, { name: 'Care' }, { name: 'Niva Bupa' }, { name: 'Apollo Munich' }
  ];

  constructor(private router: Router) {}

  startJourney(): void { this.router.navigate(['/health-insurance']); }

  selectCategory(category: InsuranceCategory): void {
    if (category.route) this.router.navigate([category.route]);
  }

  openCalculator(calculator: CalculatorCard): void {
    if (calculator.route) this.router.navigate([calculator.route]);
  }

  scrollToSection(id: string): void { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }

  openLoginModal(): void { this.showLoginModal.set(true); }
  closeLoginModal(): void { this.showLoginModal.set(false); }
  handleOTPLogin(mobile: string): void { alert(`A sign-in code has been sent to ${mobile}.`); this.closeLoginModal(); }
  handleWhatsAppLogin(mobile: string): void { alert(`We'll continue on WhatsApp at ${mobile}.`); this.closeLoginModal(); }
  handleGoogleLogin(): void { alert('Google sign-in initiated.'); }
}
