import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthGuard } from '../auth.guard';
import { Cart, CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe
  ],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cart: Cart | null = null;
  payNow: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authGuard: AuthGuard,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', Validators.required]
    });

    this.cartService.getCart().subscribe({
      next: (cart) => this.cart = cart,
      error: (error) => console.error('Error retrieving cart', error)
    });
  }

  togglePay(): void {
    this.payNow = !this.payNow;
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid || !this.cart || this.cart.items.length === 0) {
      console.log('Form is invalid or cart is empty!');
      return;
    }

    const orderData = {
      shippingAddress: this.checkoutForm.value.shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      totalPrice: this.cart.totalPrice.toString()
    };

    this.orderService.placeOrder(orderData).subscribe({
      next: () => {
        this.router.navigate(['/order-success']);
      },
      error: (error) => {
        console.error('Error placing order:', error);
        if (error.status === 401) {
          this.authGuard.logout();
        }
      }
    });
  }
}
