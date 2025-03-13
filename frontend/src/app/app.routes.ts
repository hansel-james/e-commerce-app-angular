import { Routes } from '@angular/router';
import { ThemesComponent } from './themes/themes.component';
import { ProductsComponent } from './products/products.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'themes', component: ThemesComponent
    },
    {
        path: 'products',
        component: ProductsComponent
    },
    { 
        path: '**', 
        component: NotFoundComponent 
    }, 
];