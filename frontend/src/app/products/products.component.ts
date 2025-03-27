import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductCardSkeletonComponent } from './product-card-skeleton/product-card-skeleton.component';
import { ProductSidebarComponent } from './product-sidebar/product-sidebar.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [ProductCardComponent, ProductSidebarComponent, ProductCardSkeletonComponent], 
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {  
  products: any[] = [];
  totalPages: number = 1;
  currentPage: number = 1;
  isLoading = true;
  private queryParamsSubscription!: Subscription;
  skeletonArray: number[] = [];
  isSortMenuOpen: boolean = false;

  toggleSortMenu(): boolean {
    return this.isSortMenuOpen = !this.isSortMenuOpen;
  }

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}
  
  limit = 10;

  ngOnInit(): void {
    // ✅ Subscribe to queryParams instead of router.events
    this.queryParamsSubscription = this.route.queryParams.subscribe(queryParams => {
      this.loadProducts(queryParams);
    });

    // Initial fetch (if URL already has queryParams)
    this.loadProducts(this.route.snapshot.queryParams);

    this.limit = Number(this.route.snapshot.queryParamMap.get('limit')) || 10;

    this.skeletonArray = Array.from({ length: this.limit }, (_, i) => i); // Create array of indexes

  }

  loadProducts(queryParams: { [key: string]: string } = {}): void {
    this.isLoading = true;
    this.limit = Number(this.route.snapshot.queryParamMap.get('limit')) || 10;
    this.skeletonArray = Array.from({ length: this.limit }, (_, i) => i); // Create array of indexes
    
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