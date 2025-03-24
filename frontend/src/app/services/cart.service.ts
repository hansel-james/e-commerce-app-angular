import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGuard } from '../auth.guard';

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

interface Cart {
  userId: string;
  items: CartItem[];
  totalPrice: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://e-com-app-backend-five.vercel.app/api/carts';

  constructor(private http: HttpClient, private authGuard: AuthGuard) {}

  // Fetch the user's cart
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${this.authGuard['userId']}`);
  }

  // Add an item to the cart
  addToCart(item: CartItem): Observable<Cart> {
    const userId = this.authGuard['userId'];
    return this.http.post<Cart>(`${this.apiUrl}/add`, {
      userId,
      cartItems: [item],
      totalPrice: item.product.price * item.quantity,
    });
  }

  // Remove an item from the cart
  removeFromCart(productId: string): Observable<Cart> {
    const userId = this.authGuard['userId']
    return this.http.post<Cart>(`${this.apiUrl}/remove`, { userId, productId });
  }

  // Purchase the cart
  buyCart(): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/${this.authGuard['userId']}/buy`, {});
  }
}
