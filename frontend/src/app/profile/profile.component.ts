import { Component } from '@angular/core';
import { ThemesComponent } from "./themes/themes.component";
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-profile',
  imports: [ThemesComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private authGuard: AuthGuard) {}

  logout() {
    this.authGuard.logout();
  }
}
