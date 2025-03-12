import { Component } from '@angular/core';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [ProductCardComponent], 
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent { }
