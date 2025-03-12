import { Component, effect, inject, signal } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { NavbarIconComponent } from "./navbar-icon/navbar-icon.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, NavbarIconComponent]
})
export class AppComponent {
  private themeService = inject(ThemeService);
  private router = inject(Router);

  selectedTheme = this.themeService.selectedTheme();
  isProductsPage = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);

  // ✅ Safe check for window
  isLargeScreen = signal<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  constructor() {
    effect(() => {
      this.selectedTheme = this.themeService.selectedTheme();
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.isLargeScreen.set(window.innerWidth >= 1024);
        if (this.isLargeScreen()) this.isMenuOpen.set(false);
      });
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isProductsPage.set(event.url === '/products');
    });
  }
}