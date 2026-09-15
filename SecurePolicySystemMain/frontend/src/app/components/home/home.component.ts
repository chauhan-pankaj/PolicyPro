import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginModalComponent } from '../login-modal/login-modal.component';

interface Product { id: string; icon: string; label: string; title: string; description: string; }

@Component({
  selector: 'app-home', standalone: true,
  imports: [CommonModule, RouterLink, LoginModalComponent],
  templateUrl: './home.component.html', styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  showLoginModal = signal(false);
  selectedProduct = signal('health');
  products = signal<Product[]>([
    { id: 'health', icon: '✚', label: 'FOR YOUR WELLBEING', title: 'Health insurance', description: 'Care that helps you plan for the expected and unexpected.' },
    { id: 'life', icon: '◒', label: 'FOR THE PEOPLE YOU LOVE', title: 'Life protection', description: 'A financial safety net for the people who rely on you.' },
    { id: 'motor', icon: '⌁', label: 'FOR THE ROAD AHEAD', title: 'Car & bike cover', description: 'Keep moving with cover tailored to your vehicle.' },
    { id: 'travel', icon: '⌁', label: 'FOR EVERY GETAWAY', title: 'Travel insurance', description: 'Feel prepared before your next trip takes off.' }
  ]);
  tools = [
    { icon: '◌', title: 'Cover check', description: 'Get a useful starting point for the protection your family may need.' },
    { icon: '₹', title: 'Premium planner', description: 'Understand what shapes a premium before you compare options.' },
    { icon: '↗', title: 'Renewal guide', description: 'Know what to review before your policy comes up for renewal.' }
  ];
  constructor(private router: Router) {}
  selectProduct(id: string): void { this.selectedProduct.set(id); if (id === 'health') this.startJourney(); }
  startJourney(): void { this.router.navigate(['/health-insurance']); }
  scrollToSection(id: string): void { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }
  openLoginModal(): void { this.showLoginModal.set(true); }
  closeLoginModal(): void { this.showLoginModal.set(false); }
  handleOTPLogin(mobile: string): void { alert(`A sign-in code has been sent to ${mobile}.`); this.closeLoginModal(); }
  handleWhatsAppLogin(mobile: string): void { alert(`We’ll continue on WhatsApp at ${mobile}.`); this.closeLoginModal(); }
  handleGoogleLogin(): void { alert('Google sign-in initiated.'); }
}
