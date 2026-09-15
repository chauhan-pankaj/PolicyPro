import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  protected readonly showFooter = signal(true);

  constructor(private router: Router) {
    this.setFooterVisibility(router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.setFooterVisibility(event.urlAfterRedirects));
  }

  private setFooterVisibility(url: string): void {
    this.showFooter.set(!url.startsWith('/health-insurance'));
  }
}
