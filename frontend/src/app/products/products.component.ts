import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductSidebarComponent } from './product-sidebar/product-sidebar.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [ProductCardComponent, ProductSidebarComponent], 
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {  
  products: any[] = [];
  totalPages: number = 1;
  currentPage: number = 1;
  isLoading = true;
  private queryParamsSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // ✅ Subscribe to queryParams instead of router.events
    this.queryParamsSubscription = this.route.queryParams.subscribe(queryParams => {
      this.loadProducts(queryParams);
    });

    // Initial fetch (if URL already has queryParams)
    this.loadProducts(this.route.snapshot.queryParams);
  }

  loadProducts(queryParams: { [key: string]: string } = {}): void {
    this.isLoading = true;

    this.productService.getProducts(queryParams).subscribe({
      next: (data) => {
        this.products = data.products;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load products:', err);
        this.products = [];
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
}