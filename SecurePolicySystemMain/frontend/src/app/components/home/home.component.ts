import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

interface Partner {
  id: number;
  name: string;
  logo: string;
}

interface Calculator {
  id: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  // Modal state
  showLoginModal = signal(false);

  // Testimonials carousel
  currentTestimonialIndex = signal(0);

  categories = signal<Category[]>([
    {
      id: 'health',
      title: 'Health Insurance',
      description: 'Comprehensive health coverage',
      icon: '🏥'
    },
    {
      id: 'term',
      title: 'Term Insurance',
      description: 'Affordable life protection',
      icon: '🛡️'
    },
    {
      id: 'car',
      title: 'Car Insurance',
      description: 'Complete vehicle coverage',
      icon: '🚗'
    },
    {
      id: 'bike',
      title: 'Bike Insurance',
      description: 'Reliable two-wheeler protection',
      icon: '🏍️'
    },
    {
      id: 'travel',
      title: 'Travel Insurance',
      description: 'Safe journey, anywhere',
      icon: '✈️'
    },
    {
      id: 'investment',
      title: 'Investment Plans',
      description: 'Grow your wealth wisely',
      icon: '📈'
    },
    {
      id: 'child',
      title: 'Child Plans',
      description: 'Secure your child\'s future',
      icon: '👶'
    },
    {
      id: 'retirement',
      title: 'Retirement Plans',
      description: 'Plan for golden years',
      icon: '🏡'
    }
  ]);

  testimonials = signal<Testimonial[]>([
    {
      id: 1,
      name: 'Rajesh Kumar',
      rating: 5,
      comment:
        'SureCover helped me find the best health insurance plan at a great price. The process was smooth and transparent.'
    },
    {
      id: 2,
      name: 'Priya Singh',
      rating: 5,
      comment:
        'Excellent platform! Compared multiple policies in minutes and saved ₹15,000 on my annual premium.'
    },
    {
      id: 3,
      name: 'Amit Patel',
      rating: 4,
      comment:
        'Great user experience and reliable customer support. Highly recommended for insurance shopping.'
    },
    {
      id: 4,
      name: 'Neha Sharma',
      rating: 5,
      comment:
        'Finally found a platform that makes insurance simple. Best decision to trust SureCover.'
    },
    {
      id: 5,
      name: 'Vikram Gupta',
      rating: 5,
      comment:
        'Transparent pricing, quick comparison, and instant policy activation. Absolutely fantastic!'
    }
  ]);

  partners = signal<Partner[]>([
    { id: 1, name: 'HDFC Ergo', logo: 'HDFC' },
    { id: 2, name: 'ICICI Lombard', logo: 'ICICI' },
    { id: 3, name: 'Niva Bupa', logo: 'BUPA' },
    { id: 4, name: 'Star Health', logo: 'STAR' },
    { id: 5, name: 'Care Health', logo: 'CARE' },
    { id: 6, name: 'Bajaj Allianz', logo: 'BAJAJ' },
    { id: 7, name: 'TATA AIG', logo: 'TATA' },
    { id: 8, name: 'Aditya Birla', logo: 'ADITYA' },
    { id: 9, name: 'Digit Insurance', logo: 'DIGIT' },
    { id: 10, name: 'Max Bupa', logo: 'MAX' },
    { id: 11, name: 'Apollo Munich', logo: 'APOLLO' },
    { id: 12, name: 'Religare', logo: 'RELIGARE' },
    { id: 13, name: 'United India', logo: 'UNITED' },
    { id: 14, name: 'New India', logo: 'NEWINDIA' },
    { id: 15, name: 'Oriental', logo: 'ORIENTAL' },
    { id: 16, name: 'National', logo: 'NATIONAL' },
    { id: 17, name: 'Kotak Mahindra', logo: 'KOTAK' },
    { id: 18, name: 'Edelweiss', logo: 'EDELWEISS' },
    { id: 19, name: 'ICICI Prudential', logo: 'PRUDENTIAL' },
    { id: 20, name: 'LIC', logo: 'LIC' }
  ]);

  calculators = signal<Calculator[]>([
    {
      id: 1,
      title: 'Investment Calculator',
      description: 'Calculate your investment returns',
      icon: '📊'
    },
    {
      id: 2,
      title: 'Health Insurance Calculator',
      description: 'Estimate your health cover needs',
      icon: '💊'
    },
    {
      id: 3,
      title: 'Term Insurance Calculator',
      description: 'Calculate life cover requirement',
      icon: '📋'
    }
  ]);

  currentTestimonial = computed(() => {
    const testimonials = this.testimonials();
    return testimonials[this.currentTestimonialIndex() % testimonials.length];
  });

  whyChooseItems = signal([
    {
      icon: '🏆',
      title: 'Best Price Guarantee',
      description: 'Compare and find the best deals from top insurers'
    },
    {
      icon: '⚡',
      title: 'Instant Quotes',
      description: 'Get quotes in seconds, not days'
    },
    {
      icon: '💻',
      title: '100% Digital Process',
      description: 'Apply, buy, and manage policies online'
    },
    {
      icon: '🤝',
      title: 'Claim Assistance',
      description: 'Expert support throughout your claim journey'
    }
  ]);



  constructor(private router: Router) {}

  // Navigation Methods
  navigateToInsurance(insuranceType: string): void {
    if (insuranceType === 'health') {
      this.router.navigate(['/health-insurance']);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  // Testimonials Navigation
  nextTestimonial(): void {
    this.currentTestimonialIndex.update((val) => val + 1);
  }

  previousTestimonial(): void {
    this.currentTestimonialIndex.update((val) => (val - 1 + this.testimonials().length) % this.testimonials().length);
  }

  // Modal Handlers
  openLoginModal(): void {
    this.showLoginModal.set(true);
  }

  closeLoginModal(): void {
    this.showLoginModal.set(false);
  }

  handleOTPLogin(mobileNumber: string): void {
    console.log('OTP Login:', mobileNumber);
    alert(`OTP sent to ${mobileNumber}`);
    this.closeLoginModal();
  }

  handleWhatsAppLogin(mobileNumber: string): void {
    console.log('WhatsApp Login:', mobileNumber);
    alert(`WhatsApp login for ${mobileNumber}`);
    this.closeLoginModal();
  }

  handleGoogleLogin(): void {
    console.log('Google Login');
    alert('Google login initiated');
    this.closeLoginModal();
  }

  // Scroll to section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Get rating stars
  getRatingStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
