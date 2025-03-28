import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AuthGuard } from '../auth.guard';
import { Router, RouterLink } from '@angular/router';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  categories: string[];
  imageUrl: string;
}

interface CartItem {
  product: Product
  quantity: number;
}

interface Cart {
  userId: string;
  items: CartItem[];
  totalPrice: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [RouterLink]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  userId: string | null = null; // Example userId, should be dynamically retrieved
  isLoading: boolean = true;
  totalLoading: boolean = true;
  productLoadMap: Map<String, Boolean> = new Map<String, Boolean>();

  constructor(private cartService: CartService, private authGuard: AuthGuard, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
    this.userId = this.authGuard['userId'];
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart
        // console.log('cart is : ', cart);
        this.isLoading = false;
        this.totalLoading = false;
      },
      error: (error) => console.error('Error loading cart:', error),
    });
  }

  checkIfAllProductsLoaded() {
    const allLoaded = Array.from(this.productLoadMap.values()).every(loading => !loading);
    this.totalLoading = !allLoaded;
  }  

  removeFromCart(productId: string): void {
    this.productLoadMap.set(productId, true);
    this.totalLoading = true;
    this.cartService.removeFromCart(productId).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart
        this.productLoadMap.delete(productId);
        this.checkIfAllProductsLoaded();
      },
      error: (error) => console.error('Error removing item:', error),
    });
  }

  addItem(product: Product): void {
    this.productLoadMap.set(product._id, true);
    this.totalLoading = true;
    let quantity: number = 1;
    this.cartService.addToCart({
      product,
      quantity
    }).subscribe({
      next: (updatedCart) => {
        this.productLoadMap.set(product._id, false);
        this.checkIfAllProductsLoaded();
        this.cart = updatedCart
      },
      error: (error) => console.error('Error adding item:', error),
    })
  }

  removeItem(product: Product) : void {
    this.productLoadMap.set(product._id, true);
    this.totalLoading = true;
    let quantity: number = -1;
    this.cartService.addToCart({
      product,
      quantity
    }).subscribe({
      next: (updatedCart) => {
        if(this.cart?.items.length !== updatedCart.items.length) this.productLoadMap.delete(product._id);
        else this.productLoadMap.set(product._id, false);
        this.checkIfAllProductsLoaded();
        this.cart = updatedCart
      },
      error: (error) => console.error('Error removing single item:', error),
    })
  }

  buyCart(): void {
    this.router.navigate(['/checkout']);
  }
}
