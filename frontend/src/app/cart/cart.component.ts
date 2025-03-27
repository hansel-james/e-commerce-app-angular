import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthGuard } from '../auth.guard';
import { Router, RouterLink } from '@angular/router';

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

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [RouterLink]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  userId: string | null = null; // Example userId, should be dynamically retrieved
  isLoading: boolean = true;

  constructor(private cartService: CartService, private authGuard: AuthGuard, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
    this.userId = this.authGuard['userId'];
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart
        // console.log('cart is : ', cart);
        this.isLoading = false;
      },
      error: (error) => console.error('Error loading cart:', error),
    });
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: (updatedCart) => (this.cart = updatedCart),
      error: (error) => console.error('Error removing item:', error),
    });
  }

  buyCart(): void {
    this.router.navigate(['/checkout']);
  }
}
