import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  private isLoggedIn: boolean = false;
  private userId: string | null = null;
  private apiUrl = "https://e-com-app-backend-five.vercel.app/api/users";

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: object // Inject platform ID
  ) {
    this.loadUserData();
  }

  private loadUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem("token");
      if (token) {
        this.isLoggedIn = true;
        this.extractUserId(token);
      }
    }
  }

  private extractUserId(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.id || null;
    } catch (error) {
      console.error("Invalid token:", error);
      this.userId = null;
    }
  }

  getUserId(): string | null {
    return this.userId;
  }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(["/login"], { queryParams: { callback: state.url } });
      return false;
    }
  }

  login(username: string, password: string): void {
    this.http.post(`${this.apiUrl}/login`, { username, password }).subscribe({
      next: (response: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem("token", response.token);
        }
        this.isLoggedIn = true;
        this.extractUserId(response.token);

        // Get callback URL or default to home
        const callbackUrl = this.route.snapshot.queryParams["callback"] || "/";
        this.router.navigateByUrl(callbackUrl);
      },
      error: (error) => {
        console.error("Login failed:", error);
      },
    });
  }

  signUp(username: string, password: string): void {
    this.http.post(`${this.apiUrl}/signup`, { username, password }).subscribe({
      next: (response: any) => {
        console.log("Signup successful");
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem("token", response.token);
        }
        this.isLoggedIn = true;
        this.extractUserId(response.token);

        // After successful signup, redirect to callback URL
        const callbackUrl = this.route.snapshot.queryParams["callback"] || "/";
        this.router.navigateByUrl(callbackUrl);
      },
      error: (error) => {
        console.error("Signup failed:", error);
      },
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token");
    }
    this.isLoggedIn = false;
    this.userId = null;
    this.router.navigateByUrl("/login");
  }
}
