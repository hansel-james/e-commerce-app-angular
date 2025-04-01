import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthGuard } from '../../auth.guard';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  categories: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit, AfterViewInit {

  productId: string | null = null;
  product: Product | null = null;
  quantity: number = 1;
  showSkeleton: boolean = false;
  @ViewChild('my_modal') my_modal!: ElementRef<HTMLDialogElement>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authGuard: AuthGuard,
    private router: Router,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.productService.getProduct(this.productId).subscribe(product => {
          this.product = product;
        });    
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.my_modal) {
      console.error("Modal element is not found!");
    }
  }

  handleShowModal(): void {
    // ✅ Get the actual state from Router
    const stateSnapshot = this.router.routerState.snapshot;
    const routeSnapshot = this.route.snapshot; 

    if(this.authGuard.canActivate(routeSnapshot, stateSnapshot)) {

      if (!this.my_modal?.nativeElement) {
        console.error('Modal element not found!');
        return;
      }

      // Open the modal safely
      this.my_modal.nativeElement.showModal();
    }
  }  

  handleAddToCart(): void {
    // console.log('this.product : ', this.product);
    if(this.product !== null) {
      this.showSkeleton = true;
      this.cartService.addToCart({
        product: this.product,
        quantity: this.quantity,
      }).subscribe({
        next: () => {
          this.my_modal.nativeElement.close();
          this.showSkeleton = false;
          this.quantity = 1;
        },
        error: (error) => {
          console.error('Error adding:', error);
          if(error.status === 401) {
            this.authGuard.logout();
          }
        }
      });
      // console.log('added to cart successfully');
    }
  }

  addQuantity() : void {
    this.quantity += 1;
  }
  removeQuantity() : void {
    if(this.quantity > 0) {
      this.quantity -= 1;
    }
  }
}
