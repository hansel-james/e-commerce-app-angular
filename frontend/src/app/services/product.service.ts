import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://e-com-app-backend-five.vercel.app/api/products';

  constructor(private http: HttpClient) {}

  // Fetch categories from backend
  getCategories(): Observable<string[]> {
    return this.http.get<{ categories: string[] }>(`${this.apiUrl}/categories`).pipe(
      map(response => response.categories || [])
    );
  }

  // Fetch products with optional query parameters
  getProducts(queryParams: { [key: string]: string } = {}): Observable<{ currentPage: number; totalPages: number; products: any[] }> {
    let params = new HttpParams();
    Object.keys(queryParams).forEach(key => {
      params = params.append(key, queryParams[key]);
    });
  
    return this.http.get<{ currentPage: number; totalPages: number; products: any[] }>(this.apiUrl, { params });
  }  
}
