import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn) {
      return true;
    } else {
      // Redirect to login with a callback parameter
      this.router.navigate(['/login'], { queryParams: { callback: state.url } });
      return false;
    }
  }

  login(): void {
    this.isLoggedIn = !this.isLoggedIn;
  }

  logout(): void {
    
  }
}
