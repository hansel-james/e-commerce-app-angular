import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-sidebar',
  standalone: true,
  templateUrl: './product-sidebar.component.html',
  styleUrls: ['./product-sidebar.component.css'],
  imports: [FormsModule, CommonModule],
})
export class ProductSidebarComponent {
  categories: string[] = [];
  selectedCategories: string[] = [];
  limits = [10, 20, 50, 100];
  selectedLimit: number = 10;
  showCategoryDropdown = false; // Controls dropdown visibility

  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    this.loadCategories();
    this.route.queryParams.subscribe((params) => {
      // Ensure categories are set correctly from URL
      this.selectedCategories = params['category'] ? params['category'].split(',') : [];
  
      // Ensure limit is always reflected in the URL
      this.selectedLimit = params['limit'] ? Number(params['limit']) : this.limits[0];
  
      // ✅ If limit isn't in the query params, update the URL to include it
      if (!params['limit']) {
        this.updateQueryParams();
      }
    });
  }  

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.categories = []; // Ensure categories is always defined
      }
    });
  }  

  toggleCategoryDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }

  onCategoryChange(category: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedCategories = isChecked
      ? [...this.selectedCategories, category]
      : this.selectedCategories.filter((cat) => cat !== category);

    this.updateQueryParams();
  }

  onLimitChange(event: Event) {
    this.selectedLimit = Number((event.target as HTMLSelectElement).value);
    this.updateQueryParams();
  }

  updateQueryParams() {
    this.router.navigate([], {
      queryParams: {
        category: this.selectedCategories.length ? this.selectedCategories.join(',') : null,
        limit: this.selectedLimit,
      },
      queryParamsHandling: 'merge',
    });
  }

  showLimitDropdown = false; // Controls limit dropdown

  toggleLimitDropdown() {
    this.showLimitDropdown = !this.showLimitDropdown;
  }

  onLimitSelect(limit: number) {
    this.selectedLimit = limit;
    this.showLimitDropdown = false; // Close dropdown after selection
    this.updateQueryParams();
  }

}