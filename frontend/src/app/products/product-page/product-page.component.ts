import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

interface Product {
  _id: string,
  name: string,
  price: number,
  description: string,
  categories: string[],
  imageUrl: string,
  createdAt: string,
  updatedAt: string,
}

@Component({
  selector: 'app-product-page',
  imports: [],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {

  productId: string | null = null;

  product: Product | null = null;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      this.productService.getProduct(this.productId).subscribe(product => {
        this.product = product;
      });    
    });
  }
}
