import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../auth.guard';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

interface Order {
    _id: string,
    userId: string,
    cartId: string,
    shippingAddress: string,
    paymentStatus: string,
    orderStatus: string,
    totalPrice: string,
    createdAt: string,
    updatedAt: string,
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'https://e-com-app-backend-five.vercel.app/api/orders';

  constructor(
    private http: HttpClient, 
    private authGuard: AuthGuard, 
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  private getHeaders() {
    let token: string | null = "";
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  placeOrder(): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`, { headers: this.getHeaders() });
  }
}
