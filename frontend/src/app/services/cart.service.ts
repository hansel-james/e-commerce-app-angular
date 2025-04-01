import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGuard } from '../auth.guard';
import { isPlatformBrowser } from '@angular/common';

interface CartItem {
  product: {
    categories: string[],
    description: string,
    imageUrl: string,
    name: string,
    price: number,
    _id: string,
  }
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalPrice: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/carts';

  constructor(private http: HttpClient, private authGuard: AuthGuard, @Inject(PLATFORM_ID) private platformId: object) {}

  private getHeaders() {
    let token: string | null = "";
    if(isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');  
    } 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Fetch the user's cart
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${this.authGuard['userId']}`, { headers: this.getHeaders() });
  }

  getCartById(id: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/cart/${id}`, { headers: this.getHeaders() });
  }

  // Add an item to the cart
  addToCart(item: CartItem): Observable<Cart> {
    const userId = this.authGuard['userId'];
    // console.log('trying to add ', item, ' to ', userId);
    return this.http.post<Cart>(`${this.apiUrl}/add`, {
      userId,
      cartItems: [item],
      totalPrice: item.product.price * item.quantity,
    }, { headers: this.getHeaders() });
  }

  // Remove an item from the cart
  removeFromCart(productId: string): Observable<Cart> {
    const userId = this.authGuard['userId']
    return this.http.post<Cart>(`${this.apiUrl}/remove`, { userId, productId }, { headers: this.getHeaders() });
  }

  // Purchase the cart
  buyCart(): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/${this.authGuard['userId']}/buy`, { headers: this.getHeaders() });
  }
}
