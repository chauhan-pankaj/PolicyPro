import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuoteComponent } from './components/quote/quote';
import { HealthInsuranceComponent } from './components/health-insurance/health-insurance.component';
import { MemberSelectionComponent } from './components/health-insurance/member-selection/member-selection.component';
import { MemberAgeComponent } from './components/health-insurance/member-age/member-age.component';
import { ContactDetailsComponent } from './components/health-insurance/contact-details/contact-details.component';
import { QuoteResultsComponent } from './components/health-insurance/quote-results/quote-results.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'quote', component: QuoteComponent },
	{ path: 'health-insurance', component: HealthInsuranceComponent }
];
