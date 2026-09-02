import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'PauloBot Store | Plataforma Inteligente Vending & Ecommerce'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Acceso Administrador | PauloBot Store'
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        title: 'Dashboard Administrador | PauloBot Store'
      },
      {
        path: 'productos',
        component: ProductListComponent,
        title: 'Consulta de Productos | PauloBot Store'
      },
      {
        path: 'productos/nuevo',
        component: ProductFormComponent,
        title: 'Agregar Producto | PauloBot Store'
      },
      {
        path: 'categorias',
        component: CategoryListComponent,
        title: 'Gestión de Categorías | PauloBot Store'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
