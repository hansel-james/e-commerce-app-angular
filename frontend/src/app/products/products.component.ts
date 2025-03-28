import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
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
  limit: number = 10;
  isLoading = true;
  skeletonArray: number[] = [];
  isSortMenuOpen: boolean = false;

  private queryParamsSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  toggleSortMenu(): boolean {
    return this.isSortMenuOpen = !this.isSortMenuOpen;
  }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(queryParams => {
      // Safely read page & limit from params or set defaults
      this.limit = +(queryParams['limit'] || 10);
      this.currentPage = +(queryParams['page'] || 1);

      if (this.currentPage < 1) {
        // Redirect to page 1 if invalid
        this.router.navigate([], {
          queryParams: { ...queryParams, page: 1 },
          queryParamsHandling: 'merge',
        });
        return;
      }

      this.skeletonArray = Array.from({ length: this.limit }, (_, i) => i);
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts({ page: this.currentPage.toString(), limit: this.limit.toString() }).subscribe({
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

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.router.navigate([], {
      queryParams: { page, limit: this.limit },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
}