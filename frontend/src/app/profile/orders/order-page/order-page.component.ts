import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { CartService } from '../../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css',
  imports: [CurrencyPipe]
})
export class OrderPageComponent implements OnInit {
  orderId: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private orderService: OrderService, 
    private cartService: CartService
  ) {}

  order: any = { };
  cart: any = { };
  isLoading: boolean = true;

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId'); 
    // If you need to react to changes, use:
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('orderId');
    });

    if(this.orderId !== null) {
      this.isLoading = true;
      this.orderService.getOrder(this.orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.cartService.getCartById(this.order.cartId).subscribe({
            next: (cart) => {
              this.cart = cart;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('error getting cart by id : ', error);
            }    
          })
        }, 
        error: (error) => {
          console.error('error getting order : ', error);
        }
      })
    }

  }
}
