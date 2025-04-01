import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { AuthGuard } from '../../auth.guard';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  isLoading: boolean = true;

  constructor(private authGuard: AuthGuard, private orderService: OrderService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('error retrieving orders : ', error);
        if(error.status === 401) {
          this.authGuard.logout();
        }
      }
    });
  }

}
