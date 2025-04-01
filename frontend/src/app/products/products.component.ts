import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductCardSkeletonComponent } from './product-card-skeleton/product-card-skeleton.component';
import { ProductSidebarComponent } from './product-sidebar/product-sidebar.component';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [ProductCardComponent, ProductSidebarComponent, ProductCardSkeletonComponent, CommonModule],
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
  selectedSort: string = ''; // Holds the current sort value

  private queryParamsSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  toggleSortMenu(): void {
    this.isSortMenuOpen = !this.isSortMenuOpen;
  }

  // Method to handle sort option selection
  onSortChange(sortOption: string): void {
    const queryParams = { ...this.route.snapshot.queryParams };

    if (sortOption) {
      queryParams['sort'] = sortOption;
    } else {
      // If no sort selected, avoid adding 'sort' param
      if (queryParams['sort']) {
        delete queryParams['sort'];
      }
    }

    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge', // Merge with existing params (like page, limit)
    });
  }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(queryParams => {
      // Extract page, limit, and sort safely with defaults
      this.currentPage = +(queryParams['page'] || 1);
      this.limit = +(queryParams['limit'] || 10);
      this.selectedSort = queryParams['sort'] || ''; // Set the selected sort option
      this.skeletonArray = Array.from({ length: this.limit }, (_, i) => i);
      this.loadProducts(queryParams);
    });
  }

  loadProducts(queryParams: { [key: string]: any } = {}): void {
    this.isLoading = true;
    this.productService.getProducts(queryParams).subscribe({
      next: (data) => {
        this.products = data.products;
        this.currentPage = data.currentPage;   // ✅ Server driven or fallback to query param
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

  goToPage(page: number): void {
    // ✅ Clamp page between 1 and totalPages
    page = Math.max(1, Math.min(page, this.totalPages));
    this.router.navigate([], {
      queryParams: { ...this.route.snapshot.queryParams, page }, // merge other params like search, limit etc.
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
  }
}
