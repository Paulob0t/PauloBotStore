# 🤖 PauloBot Store — Ecosistema Inteligente Vending & POS eCommerce

[![PHP Version](https://img.shields.io/badge/PHP-8.2%2B%20%7C%208.5-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![Angular](https://img.shields.io/badge/Angular-22%20Standalone-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0%20Swagger-85EA2D?style=for-the-badge&logo=openapi-initiative&logoColor=black)](https://swagger.io/)
[![Server](https://img.shields.io/badge/Server-FrankenPHP-00ADD8?style=for-the-badge&logo=caddy&logoColor=white)](https://frankenphp.dev/)
[![Database](https://img.shields.io/badge/Database-MySQL%20Dual-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 📌 Visión General de la Arquitectura

**PauloBot Store** se encuentra en un proceso continuo de **refactorización y migración arquitectónica** desde un monolito en PHP nativo hacia una arquitectura desacoplada moderna basada en **API REST (PHP 8 + FrankenPHP + Swagger/OpenAPI)** y una **Single Page Application (SPA en Angular 22 + Tailwind CSS + Vite)**.

```mermaid
graph TD
    subgraph Frontend_SPA ["⚡ Frontend SPA (Angular 22 + Tailwind CSS)"]
        Landing["Landing Page (HomeComponent)"]
        Login["Login Screen (LoginComponent)"]
        AdminShell["Admin Layout (Sidebar Modular)"]
        Dashboard["Dashboard (KPIs & Gráfica 7 Días)"]
        ProductsList["Consulta Productos (ProductListComponent)"]
        ProductsForm["Agregar Producto (ProductFormComponent)"]
        CategoriesList["Categorías (CategoryListComponent)"]
        SubcategoriesList["Subcategorías (SubcategoryListComponent)"]
        AuthSvc["AuthService (Signals)"]
        ProdSvc["ProductService (Signals)"]
        CatSvc["CategoryService (Signals)"]
        OpenApiGen["Servicios Generados (ng-openapi-gen)"]
    end

    subgraph Backend_REST ["🔙 Backend REST API (PHP 8 + FrankenPHP)"]
        Router["Router REST & CORS"]
        AuthController["AuthController (/api/v1/auth/*)"]
        DashboardController["DashboardController (/api/v1/dashboard)"]
        ProductController["ProductController (/api/v1/products/*)"]
        CategoryController["CategoryController (/api/v1/categories/*, /api/v1/subcategories/*)"]
        DocsController["DocsController (/api/v1/openapi.json, /api/docs)"]
        Database["Database Dual (Local / Nube Fallback)"]
    end

    AdminShell --> Dashboard
    AdminShell --> ProductsList
    AdminShell --> ProductsForm
    AdminShell --> CategoriesList
    AdminShell --> SubcategoriesList
    ProductsList --> ProdSvc
    ProductsForm --> ProdSvc
    ProductsForm --> CatSvc
    CategoriesList --> CatSvc
    SubcategoriesList --> CatSvc
    AuthSvc --> OpenApiGen
    ProdSvc --> OpenApiGen
    CatSvc --> OpenApiGen
    OpenApiGen -->|JSON / HTTP| Router
    Router --> AuthController
    Router --> DashboardController
    Router --> ProductController
    Router --> CategoryController
    ProductController --> Database
    CategoryController --> Database
    DashboardController --> Database
    AuthController --> Database
```

---

## 🚀 Módulos Migrados

### 🔙 1. Backend REST API (`backend/`)
- **Cero HTML:** Todo endpoint responde exclusivamente en `application/json` con cabeceras CORS unificadas.
- **Swagger / OpenAPI 3.0 Integrado:** Atributos nativos PHP 8 (`#[OA\Post]`, `#[OA\Get]`, `#[OA\Put]`, `#[OA\Delete]`, `#[OA\Patch]`).
  - Documentación interactiva en [`/api/docs`](http://localhost:8000/api/docs) con **Swagger UI**.
  - Esquema dinámico en [`/api/v1/openapi.json`](http://localhost:8000/api/v1/openapi.json).
- **Módulo de Autenticación:** `login`, `register`, `me`, `logout` con verificación multi-hash (BCrypt + MD5 upgrade).
- **Módulo de Dashboard:** KPIs en tiempo real (Ventas Hoy, Ventas Mes, Inventario, Stock Bajo, Gráfica 7 días, Top Ventas).
- **Módulo de Productos:**
  - `GET /api/v1/products`: Catálogo completo con stock, slots de ubicación y precios.
  - `POST /api/v1/products`: Alta de productos con validaciones y compresión.
  - `GET /api/v1/products/{id}`: Detalle de producto.
  - `GET /api/v1/products/{id}/image`: Servidor de imágenes con caché HTTP de 24 horas.
  - `DELETE /api/v1/products/{id}`: Eliminación segura.
- **Módulo de Categorías y Subcategorías:**
  - `GET /api/v1/categories`: Lista anidada de categorías y subcategorías.
  - `POST /api/v1/categories`: Crear categoría con subcategorías al vuelo.
  - `PUT /api/v1/categories/{id}`: Actualizar categoría.
  - `DELETE /api/v1/categories/{id}`: Eliminar categoría en cascada.
  - `GET /api/v1/subcategories`: Lista plana de subcategorías con categoría padre.
  - `POST /api/v1/categories/{id}/subcategories`: Agregar subcategoría.
  - `PUT /api/v1/subcategories/{id}`: Actualizar subcategoría.
  - `DELETE /api/v1/subcategories/{id}`: Eliminar subcategoría.

### ⚡ 2. Frontend SPA (`frontend/`)
- **Stack Moderno:** Angular 22 Standalone Components, Signals (`signal`, `computed`), Formularios Reactivos y Tailwind CSS v4.
- **Generación Automática:** Cliente TypeScript generado con `ng-openapi-gen` desde la API.
- **Vistas Disponibles:**
  - 🏠 **Landing Page:** [`HomeComponent`](file:///home/paulobot/PauloBotStore/frontend/src/app/pages/home/home.component.ts)
  - 🔐 **Login Administrador:** [`LoginComponent`](file:///home/paulobot/PauloBotStore/frontend/src/app/pages/login/login.component.ts)
  - 📊 **Dashboard:** [`DashboardComponent`](file:///home/paulobot/PauloBotStore/frontend/src/app/pages/dashboard/dashboard.component.ts)
  - 📋 **Consulta de Productos:** [`ProductListComponent`](file:///home/paulobot/PauloBotStore/frontend/src/app/pages/products/product-list/product-list.component.ts)
  - ➕ **Agregar Producto:** [`ProductFormComponent`](file:///home/paulobot/PauloBotStore/frontend/src/app/pages/products/product-form/product-form.component.ts) (con compresión Canvas en cliente)
  - 🏷️ **Gestión de Categorías:** [`CategoryListComponent`](file:///home/paulobot/PauloBotStore/frontend/src/app/pages/categories/category-list/category-list.component.ts)
  - 🗂️ **Gestión de Subcategorías:** [`SubcategoryListComponent`](file:///home/paulobot/PauloBotStore/frontend/src/app/pages/categories/subcategory-list/subcategory-list.component.ts)

---

## ⚙️ Cómo Ejecutar el Proyecto

### 1. Iniciar Backend REST API (Puerto 8000)
```bash
cd PauloBotStore
./frankenphp php-server --listen 0.0.0.0:8000 --root ./backend/public
```
- **Swagger UI:** [`http://localhost:8000/api/docs`](http://localhost:8000/api/docs)
- **OpenAPI JSON:** [`http://localhost:8000/api/v1/openapi.json`](http://localhost:8000/api/v1/openapi.json)

### 2. Iniciar Frontend SPA (Puerto 4200)
```bash
cd PauloBotStore/frontend
npm start
```
- **SPA General:** [`http://localhost:4200/`](http://localhost:4200/)
- **Dashboard:** [`http://localhost:4200/admin`](http://localhost:4200/admin)
- **Consulta Productos:** [`http://localhost:4200/admin/productos`](http://localhost:4200/admin/productos)
- **Agregar Producto:** [`http://localhost:4200/admin/productos/nuevo`](http://localhost:4200/admin/productos/nuevo)
- **Categorías:** [`http://localhost:4200/admin/categorias`](http://localhost:4200/admin/categorias)
- **Subcategorías:** [`http://localhost:4200/admin/subcategorias`](http://localhost:4200/admin/subcategorias)

### 3. Regenerar Servicios e Interfaces de TypeScript
```bash
cd PauloBotStore/frontend
npm run api:generate
```
