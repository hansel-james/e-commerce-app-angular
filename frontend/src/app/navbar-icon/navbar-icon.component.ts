import { Component, Input } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar-icon',
  standalone: true, // ✅ Standalone component
  imports: [RouterModule, RouterLink, RouterLinkActive, NgClass], // ✅ Import necessary modules
  templateUrl: './navbar-icon.component.html',
  styleUrl: './navbar-icon.component.css'
})
export class NavbarIconComponent {
  @Input() link: string = ''; // ✅ Navigation link
  @Input() icon: string = ''; // ✅ Icon class
  @Input() text: string = ''; // ✅ Text label

  getRouterLinkActiveOptions() {
    return this.link === '/products' ? { exact: false } : { exact: true };
  }
}
