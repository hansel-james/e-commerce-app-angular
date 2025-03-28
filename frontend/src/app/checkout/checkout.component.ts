import { Component } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { Cart, CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  cart: Cart | null = null;
  payNow: boolean = true;

  constructor(
    private authGuard: AuthGuard,
    private cartService: CartService,
    private orderService: OrderService
  ) {
    this.cartService.getCart().subscribe({
      next: (cart) => this.cart = cart,
      error: (error) => console.error('error in retrieving cart', error)
    });
  }

  togglePay(): void {
    this.payNow = !this.payNow;
  }

}
