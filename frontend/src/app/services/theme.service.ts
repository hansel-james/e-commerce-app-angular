import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly defaultTheme = 'winter'; // ✅ Fallback theme
  selectedTheme = signal<string>(this.defaultTheme); // ✅ Initialize with default, update later

  constructor() {
    this.loadStoredTheme(); // ✅ Load theme asynchronously on service init
  }

  private async loadStoredTheme() {
    const theme = await this.getStoredTheme(); // ✅ Wait for localStorage read
    this.selectedTheme.set(theme); // ✅ Update signal after retrieval
  }

  private getStoredTheme(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => { // ✅ Simulate async read
        if (typeof window !== 'undefined') {
          resolve(localStorage.getItem('theme') || this.defaultTheme);
        } else {
          resolve(this.defaultTheme);
        }
      }, 0);
    });
  }

  setTheme(theme: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme); // ✅ Update localStorage only in the browser
    }
    this.selectedTheme.set(theme); // ✅ Update signal state
  }
}