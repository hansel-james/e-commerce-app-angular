import { Component, Input } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar-icon',
  standalone: true, // ✅ Standalone component
  imports: [RouterModule, RouterLink, RouterLinkActive], // ✅ Import necessary modules
  templateUrl: './navbar-icon.component.html',
  styleUrl: './navbar-icon.component.css'
})
export class NavbarIconComponent {
  @Input() link: string = ''; // ✅ Navigation link
  @Input() icon: string = ''; // ✅ Icon class
  @Input() text: string = ''; // ✅ Text label
}
