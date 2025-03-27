import { Component } from '@angular/core';
import { ThemesComponent } from "./themes/themes.component";
import { AuthGuard } from '../auth.guard';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true, // Standalone component support
  imports: [ThemesComponent, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: {
    _id: string,
    username: string,
    createdAt: string,
    updatedAt: string,
  } | null = null;

  constructor(private authGuard: AuthGuard) {
    this.authGuard.user$.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.authGuard.logout();
  }
}
