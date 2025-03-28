import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { 
        path: 'profile', 
        component: ProfileComponent,
        canActivate: [AuthGuard],
    },
    { 
        path: 'products',
        loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent) // ✅ Lazy load component
    },
    {
        path: 'products/:id',
        loadComponent: () => import('./products/product-page/product-page.component').then(m => m.ProductPageComponent) // ✅ Lazy load component
    },
    {
        path: 'cart',
        component: CartComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [AuthGuard],
    },
    { path: 'login', component: LoginComponent },
    { path: '**', component: NotFoundComponent }, 
];
