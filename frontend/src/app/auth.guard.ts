import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import { jwtDecode } from "jwt-decode";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  private isLoggedIn: boolean = false;
  private userId: string | null = null;
  private apiUrl = "https://e-com-app-backend-five.vercel.app/api/users";

  private userSubject = new BehaviorSubject<{ 
    _id: string, username: string, createdAt: string, updatedAt: string 
  } | null>(null);
  
  user$ = this.userSubject.asObservable(); // Expose observable for components

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: object) {
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
      if (this.userId) {
        this.fetchUserData();
      }
    } catch (error) {
      console.error("Invalid token:", error);
      this.userId = null;
      this.logout();
    }
  }

  private fetchUserData(): void {
    if (this.userId) {
      const token = isPlatformBrowser(this.platformId) ? localStorage.getItem("token") : null;

      if (!token) {
        console.error("No token found");
        return;
      }

      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      this.http.get<{ _id: string, username: string, createdAt: string, updatedAt: string }>(
        `${this.apiUrl}/${this.userId}`,
        { headers }
      ).subscribe({
        next: (data) => {
          this.userSubject.next(data); // Update BehaviorSubject
        },
        error: (error) => {
          console.error("Failed to fetch user data:", error);
          this.userSubject.next(null);
          this.logout();
        },
      });
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
        this.fetchUserData();
        const callbackUrl = this.route.snapshot.queryParams["callback"] || "/";
        this.router.navigateByUrl(callbackUrl);
      },
      error: (error) => {
        console.error("Login failed:", error);
        this.logout();
      },
    });
  }

  signUp(username: string, password: string): void {
    this.http.post(`${this.apiUrl}/signup`, { username, password }).subscribe({
      next: (response: any) => {
        // console.log("Signup successful");
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem("token", response.token);
        }
        this.isLoggedIn = true;
        this.extractUserId(response.token);
        this.fetchUserData();
        const callbackUrl = this.route.snapshot.queryParams["callback"] || "/";
        this.router.navigateByUrl(callbackUrl);
      },
      error: (error) => {
        console.error("Signup failed:", error);
        this.logout();
      },
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("token");
    }
    this.isLoggedIn = false;
    this.userId = null;
    this.userSubject.next(null);
    this.router.navigateByUrl("/login");
  }
}
