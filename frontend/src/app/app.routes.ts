import { Routes } from '@angular/router';
import { ThemesComponent } from './themes/themes.component';
import { ProductCardComponent } from './products/product-card/product-card.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
    {
        path: '', component: ThemesComponent
    },
    {
        path: 'themes', component: ThemesComponent
    },
    {
        path: 'products',
        component: ProductsComponent
    }
];