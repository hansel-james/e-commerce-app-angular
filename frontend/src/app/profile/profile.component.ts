import { Component } from '@angular/core';
import { ThemesComponent } from "./themes/themes.component";

@Component({
  selector: 'app-profile',
  imports: [ThemesComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
