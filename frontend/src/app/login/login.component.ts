import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  constructor(
    private authGuard: AuthGuard, 
    private router: Router, 
    private route: ActivatedRoute // Ensure ActivatedRoute is properly injected
  ) {}

  login(): void {
    this.authGuard.login(); // Simulate login

    // Ensure route is properly defined before accessing queryParams
    if (this.route) {
      const callbackUrl = this.route.snapshot?.queryParams?.['callback'] || '/';
      this.router.navigateByUrl(callbackUrl); // Redirect to the intended page
    } else {
      console.error("ActivatedRoute is undefined");
    }
  }
}
