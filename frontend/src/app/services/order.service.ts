import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from '../auth.guard';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { Cart } from './cart.service';

interface Order {
    _id: string,
    userId: string,
    cartId: string,
    cart: Cart,
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
  private apiUrl = 'http://localhost:5000/api/orders';

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

  placeOrder(orderData: {
    shippingAddress: string;
    paymentStatus: string;
    orderStatus: string;
    totalPrice: string;
  }): Observable<Order> {
      return this.http.post<Order>(`${this.apiUrl}`, orderData, { headers: this.getHeaders() });
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`, { headers: this.getHeaders() });
  }
}
