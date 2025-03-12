import { Routes } from '@angular/router';
import { ThemesComponent } from './themes/themes.component';

export const routes: Routes = [
    {
        path: '', component: ThemesComponent
    },
    {
        path: 'themes', component: ThemesComponent
    },
    {
        path: 'products',
        loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent) // Lazy load component
    }
];