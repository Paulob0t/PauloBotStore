import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  signal,
  computed,
  OnDestroy,
  inject,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { ProductDto, CategoryDto } from '../../api/models';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      <!-- Navbar Superior de la Tienda -->
      <header class="sticky top-0 z-50 bg-slate-900/95 border-b border-slate-800 shadow-md shadow-black/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            
            <!-- Logo & Identidad de Marca -->
            <a routerLink="/" class="flex items-center gap-3.5 group">
              <div class="w-11 h-11 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-600/30 group-hover:scale-105 group-hover:shadow-indigo-600/50 transition-all duration-300">
                <i class="fas fa-robot"></i>
              </div>
              <div>
                <div class="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                  PauloBot <span class="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Store</span>
                </div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Vending Machine 24/7
                </div>
              </div>
            </a>

            <!-- Acciones Derecha: Inicio, Admin & Carrito -->
            <div class="flex items-center gap-3 sm:gap-4">
              <a
                routerLink="/"
                class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                <i class="fas fa-house text-indigo-400"></i>
                <span>Inicio</span>
              </a>

              <a
                routerLink="/admin"
                class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                <i class="fas fa-shield-halved text-indigo-400"></i>
                <span>Panel Admin</span>
              </a>

              <!-- Botón Carrito con Contador Reactivo -->
              <button
                type="button"
                (click)="toggleCartDrawer()"
                class="relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <i class="fas fa-shopping-cart text-sm"></i>
                <span class="hidden sm:inline">Carrito</span>
                <span class="px-2 py-0.5 rounded-full bg-white text-indigo-700 text-xs font-black shadow-inner">
                  {{ cartItemsCount() }}
                </span>
                @if (cartSubtotal() > 0) {
                  <span class="hidden md:inline font-mono border-l border-indigo-400/40 pl-2">
                    {{ cartSubtotal() | currency:'MXN':'symbol':'1.2-2' }}
                  </span>
                }
              </button>
            </div>

          </div>
        </div>
      </header>

      <!-- Toast Flotante de Producto Agregado -->
      @if (toastMessage()) {
        <div class="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in font-medium text-sm">
          <i class="fas fa-check-circle text-lg"></i>
          <span>{{ toastMessage() }}</span>
        </div>
      }

      <!-- Contenido Principal -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        <!-- Hero Banner Promocional -->
        <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 p-8 sm:p-12 shadow-xl">
          <div class="relative z-10 max-w-2xl space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
              <i class="fas fa-bolt text-amber-400"></i> Despacho Inteligente & Inmediato
            </div>
            <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Tus Snacks & Bebidas favoritas al instante
            </h1>
            <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explora nuestro catálogo interactivo. Selecciona lo que deseas y recógelo inmediatamente en el dispensador automatizado.
            </p>
          </div>
        </section>

        <!-- SECCIÓN 1: Carrusel de Productos Destacados (GPU-Accelerated 60 FPS) -->
        <section class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <i class="fas fa-fire text-amber-400"></i> Selección Especial
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 60 FPS GPU
                </span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Productos Destacados
              </h2>
            </div>

            <!-- Botones de Control Manual -->
            <div class="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                (click)="prevFeatured()"
                class="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                title="Anterior"
              >
                <i class="fas fa-chevron-left text-sm"></i>
              </button>
              <button
                type="button"
                (click)="nextFeatured()"
                class="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                title="Siguiente"
              >
                <i class="fas fa-chevron-right text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Pista del Carrusel de Productos -->
          @if (isLoadingFeatured()) {
            <div class="py-16 text-center text-slate-500">
              <i class="fas fa-spinner fa-spin text-3xl text-indigo-500 mb-3"></i>
              <p class="text-sm">Cargando productos destacados...</p>
            </div>
          } @else if (featuredProducts().length > 0) {
            <div
              #featuredWrapper
              (mouseenter)="pauseFeatured()"
              (mouseleave)="resumeFeatured()"
              (touchstart)="pauseFeatured()"
              (touchend)="resumeFeatured()"
              class="relative overflow-hidden w-full py-2"
            >
              <!-- Track Desplazable con GPU Transform -->
              <div
                class="flex gap-6 transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
                [style.transform]="'translate3d(' + -featuredOffset() + 'px, 0, 0)'"
              >
                @for (product of featuredProducts(); track product.id_producto) {
                  <div class="w-72 sm:w-80 shrink-0 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-5 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between group">
                    
                    <!-- Contenedor Imagen y Badges -->
                    <div class="space-y-4">
                      <div class="relative h-48 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center">
                        
                        <!-- Badge Destacado / Orden -->
                        <span class="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <i class="fas fa-star text-[9px]"></i> Top #{{ product.orden_destacado || 1 }}
                        </span>

                        <!-- Badge Descuento si aplica -->
                        @if (product.descuento && product.descuento > 0 && product.descuento < product.precio) {
                          <span class="absolute top-3 right-3 z-10 px-2 py-1 rounded-xl bg-slate-900/90 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-wider shadow-md">
                            ¡OFERTA!
                          </span>
                        }

                        <!-- Imagen con Miniatura WebP Optimizada -->
                        @if (product.tiene_imagen === 1) {
                          <img
                            [src]="getProductImageUrl(product.id_producto)"
                            [alt]="product.nombre_producto"
                            class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                            decoding="async"
                            loading="lazy"
                            (error)="onImageError($event)"
                          />
                        } @else {
                          <div class="text-center p-6 text-slate-600">
                            <i class="fas fa-box-open text-4xl mb-2 block text-slate-700"></i>
                            <span class="text-[11px] font-medium text-slate-500">Sin Fotografía</span>
                          </div>
                        }
                      </div>

                      <!-- Datos del Producto -->
                      <div>
                        <div class="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1 truncate">
                          {{ product.nombre_categoria || 'Categoría General' }}
                        </div>
                        <h3 class="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1" [title]="product.nombre_producto">
                          {{ product.nombre_producto }}
                        </h3>
                        @if (product.descripcion) {
                          <p class="text-xs text-slate-400 line-clamp-2 mt-1 min-h-[2rem]">
                            {{ product.descripcion }}
                          </p>
                        }
                      </div>
                    </div>

                    <!-- Precios y Botón Agregar -->
                    <div class="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between gap-3">
                      <div>
                        @if (product.descuento && product.descuento > 0 && product.descuento < product.precio) {
                          <div class="text-xs text-slate-500 line-through font-mono">
                            {{ product.precio | currency:'MXN':'symbol':'1.2-2' }}
                          </div>
                          <div class="text-xl font-black text-emerald-400 font-mono">
                            {{ product.descuento | currency:'MXN':'symbol':'1.2-2' }}
                          </div>
                        } @else {
                          <div class="text-xl font-black text-white font-mono">
                            {{ product.precio | currency:'MXN':'symbol':'1.2-2' }}
                          </div>
                        }
                      </div>

                      <button
                        type="button"
                        (click)="addToCart(product)"
                        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all cursor-pointer shrink-0 active:scale-95"
                      >
                        <i class="fas fa-cart-plus"></i>
                        <span>Agregar</span>
                      </button>
                    </div>

                  </div>
                }
              </div>
            </div>

            <!-- Dots Indicadores -->
            @if (featuredDotsCount() > 1) {
              <div class="flex justify-center items-center gap-2 pt-2">
                @for (dot of [].constructor(featuredDotsCount()); track $index) {
                  <button
                    type="button"
                    (click)="goToFeaturedSlide($index)"
                    [class.bg-indigo-500]="$index === featuredSlideIndex()"
                    [class.w-7]="$index === featuredSlideIndex()"
                    [class.bg-slate-700]="$index !== featuredSlideIndex()"
                    [class.w-2.5]="$index !== featuredSlideIndex()"
                    class="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                    [title]="'Ir a grupo ' + ($index + 1)"
                  ></button>
                }
              </div>
            }
          } @else {
            <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
              No hay productos destacados configurados en este momento.
            </div>
          }
        </section>

        <!-- SECCIÓN 2: Carrusel de Categorías (GPU-Accelerated 60 FPS) -->
        <section class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <i class="fas fa-layer-group text-indigo-400"></i> Catálogo Completo
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Navegación Fluida
                </span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Explora por Categorías
              </h2>
            </div>

            <!-- Botones de Control Manual -->
            <div class="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                (click)="prevCategory()"
                class="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                title="Anterior"
              >
                <i class="fas fa-chevron-left text-sm"></i>
              </button>
              <button
                type="button"
                (click)="nextCategory()"
                class="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                title="Siguiente"
              >
                <i class="fas fa-chevron-right text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Pista del Carrusel de Categorías -->
          @if (isLoadingCategories()) {
            <div class="py-16 text-center text-slate-500">
              <i class="fas fa-spinner fa-spin text-3xl text-indigo-500 mb-3"></i>
              <p class="text-sm">Cargando categorías...</p>
            </div>
          } @else if (categories().length > 0) {
            <div
              #categoryWrapper
              (mouseenter)="pauseCategories()"
              (mouseleave)="resumeCategories()"
              (touchstart)="pauseCategories()"
              (touchend)="resumeCategories()"
              class="relative overflow-hidden w-full py-2"
            >
              <!-- Track Desplazable con GPU Transform -->
              <div
                class="flex gap-6 transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
                [style.transform]="'translate3d(' + -categoryOffset() + 'px, 0, 0)'"
              >
                @for (cat of categories(); track cat.id) {
                  <div class="w-72 sm:w-80 h-96 shrink-0 relative rounded-3xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 shadow-xl group cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-slate-900">
                    
                    <!-- Fondo con Imagen Optimizada de Categoría o Gradiente -->
                    @if (cat.tiene_imagen === 1) {
                      <img
                        [src]="getCategoryImageUrl(cat.id)"
                        [alt]="cat.nombre"
                        class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                        decoding="async"
                        loading="lazy"
                      />
                    } @else {
                      <div class="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex items-center justify-center">
                        <i class="fas fa-tags text-7xl text-indigo-500/20 group-hover:scale-105 group-hover:text-indigo-500/30 transition-all duration-500"></i>
                      </div>
                    }

                    <!-- Overlay Oscuro Degradado -->
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

                    <!-- Contenido Superior: Badge de Subcategorías -->
                    <div class="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                      <span class="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-indigo-300 text-[11px] font-black uppercase tracking-wider shadow-md">
                        {{ (cat.subcategorias?.length || 0) }} Subcategorías
                      </span>
                      <div class="w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 flex items-center justify-center text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-md">
                        <i class="fas fa-arrow-up-right-from-square"></i>
                      </div>
                    </div>

                    <!-- Contenido Inferior: Título & Botón -->
                    <div class="absolute bottom-6 left-6 right-6 space-y-3 z-10">
                      <h3 class="text-2xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">
                        {{ cat.nombre }}
                      </h3>

                      @if (cat.subcategorias && cat.subcategorias.length > 0) {
                        <div class="flex flex-wrap gap-1.5 pt-1">
                          @for (sub of cat.subcategorias.slice(0, 3); track sub.id) {
                            <span class="px-2 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700 text-[10px] font-semibold text-slate-300">
                              {{ sub.nombre }}
                            </span>
                          }
                          @if (cat.subcategorias.length > 3) {
                            <span class="px-1.5 py-0.5 rounded-lg bg-slate-800/90 text-[10px] text-slate-400">
                              +{{ cat.subcategorias.length - 3 }}
                            </span>
                          }
                        </div>
                      }

                      <div class="pt-2">
                        <span class="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                          <span>Ver Productos</span>
                          <i class="fas fa-arrow-right text-xs"></i>
                        </span>
                      </div>
                    </div>

                  </div>
                }
              </div>
            </div>

            <!-- Dots Indicadores de Categorías -->
            @if (categoryDotsCount() > 1) {
              <div class="flex justify-center items-center gap-2 pt-2">
                @for (dot of [].constructor(categoryDotsCount()); track $index) {
                  <button
                    type="button"
                    (click)="goToCategorySlide($index)"
                    [class.bg-indigo-500]="$index === categorySlideIndex()"
                    [class.w-7]="$index === categorySlideIndex()"
                    [class.bg-slate-700]="$index !== categorySlideIndex()"
                    [class.w-2.5]="$index !== categorySlideIndex()"
                    class="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                    [title]="'Ir a grupo ' + ($index + 1)"
                  ></button>
                }
              </div>
            }
          } @else {
            <div class="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm">
              No hay categorías disponibles en este momento.
            </div>
          }
        </section>

      </main>

      <!-- Drawer Lateral de Carrito de Compras -->
      @if (showCartDrawer()) {
        <div class="fixed inset-0 z-50 overflow-hidden animate-fade-in">
          <div
            (click)="toggleCartDrawer()"
            class="absolute inset-0 bg-slate-950/80 transition-opacity"
          ></div>

          <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div class="w-screen max-w-md bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
              
              <!-- Header Drawer -->
              <div>
                <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                      <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div>
                      <h3 class="font-black text-lg text-white">Tu Carrito</h3>
                      <p class="text-xs text-slate-400">{{ cartItemsCount() }} artículos seleccionados</p>
                    </div>
                  </div>
                  <button
                    (click)="toggleCartDrawer()"
                    class="w-8 h-8 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <i class="fas fa-xmark"></i>
                  </button>
                </div>

                <!-- Lista de Artículos -->
                <div class="divide-y divide-slate-800/60 max-h-[60vh] overflow-y-auto my-4 pr-1">
                  @if (cartItems().length === 0) {
                    <div class="py-16 text-center text-slate-500">
                      <i class="fas fa-cart-arrow-down text-4xl mb-3 block text-slate-600"></i>
                      <p class="text-sm font-semibold text-slate-400">Tu carrito está vacío</p>
                      <p class="text-xs text-slate-500 mt-1">Agrega productos del carrusel para comenzar.</p>
                    </div>
                  } @else {
                    @for (item of cartItems(); track item.id_producto) {
                      <div class="py-4 flex items-center gap-4">
                        <div class="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                          @if (item.tiene_imagen === 1) {
                            <img [src]="getProductImageUrl(item.id_producto)" [alt]="item.nombre_producto" class="w-full h-full object-contain p-1" />
                          } @else {
                            <i class="fas fa-box text-slate-600"></i>
                          }
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="text-sm font-bold text-white truncate">{{ item.nombre_producto }}</h4>
                          <div class="text-xs font-mono text-emerald-400 font-bold">
                            {{ item.precio_final | currency:'MXN':'symbol':'1.2-2' }}
                          </div>
                          
                          <!-- Controles de Cantidad -->
                          <div class="flex items-center gap-2 mt-2">
                            <button
                              (click)="cartService.updateQuantity(item.id_producto, item.cantidad - 1)"
                              class="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span class="text-xs font-mono font-bold text-white px-2">
                              {{ item.cantidad }}
                            </span>
                            <button
                              (click)="cartService.updateQuantity(item.id_producto, item.cantidad + 1)"
                              class="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <!-- Botón Eliminar -->
                        <button
                          (click)="cartService.removeItem(item.id_producto)"
                          class="w-8 h-8 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center cursor-pointer transition-colors"
                          title="Eliminar artículo"
                        >
                          <i class="fas fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    }
                  }
                </div>
              </div>

              <!-- Footer Drawer: Totales & Checkout -->
              @if (cartItems().length > 0) {
                <div class="pt-4 border-t border-slate-800 space-y-4">
                  <div class="space-y-1 text-sm">
                    <div class="flex justify-between text-slate-400 text-xs">
                      <span>Subtotal</span>
                      <span class="font-mono">{{ cartSubtotal() | currency:'MXN':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="flex justify-between text-white font-black text-lg pt-1">
                      <span>Total</span>
                      <span class="font-mono text-emerald-400">{{ cartSubtotal() | currency:'MXN':'symbol':'1.2-2' }}</span>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <button
                      type="button"
                      class="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-credit-card"></i>
                      <span>Pagar en Máquina / Despachar</span>
                    </button>
                    
                    <button
                      type="button"
                      (click)="cartService.clear()"
                      class="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                </div>
              }

            </div>
          </div>
        </div>
      }

      <!-- Footer General de la Tienda -->
      <footer class="border-t border-slate-800 bg-slate-900 py-8 text-center text-xs text-slate-500">
        <p>PauloBot Store &copy; 2026 — Plataforma Inteligente Vending & Ecommerce Desacoplada</p>
      </footer>

    </div>
  `
})
export class StoreComponent implements OnInit, OnDestroy {
  @ViewChild('featuredWrapper') featuredWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('categoryWrapper') categoryWrapper!: ElementRef<HTMLDivElement>;

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  public cartService = inject(CartService);

  featuredProducts = signal<ProductDto[]>([]);
  categories = signal<CategoryDto[]>([]);
  
  isLoadingFeatured = signal<boolean>(true);
  isLoadingCategories = signal<boolean>(true);
  
  showCartDrawer = signal<boolean>(false);
  toastMessage = signal<string | null>(null);

  // Computados de Carrito
  readonly cartItems = this.cartService.items;
  readonly cartItemsCount = this.cartService.totalItems;
  readonly cartSubtotal = this.cartService.subtotal;

  // Índices de posición para GPU Slide
  featuredSlideIndex = signal<number>(0);
  categorySlideIndex = signal<number>(0);

  // Parámetros de tarjetas y pasos
  private cardWidth = 320;
  private cardGap = 24;
  private visibleCount = 3;

  private featuredInterval: any = null;
  private categoriesInterval: any = null;
  private isFeaturedHovered = false;
  private isCategoriesHovered = false;

  @HostListener('window:resize')
  onResize(): void {
    this.updateVisibleCount();
  }

  async ngOnInit(): Promise<void> {
    this.updateVisibleCount();

    await Promise.all([
      this.loadFeatured(),
      this.loadCategories()
    ]);

    this.startAutoSlides();
  }

  ngOnDestroy(): void {
    this.stopAutoSlides();
  }

  private updateVisibleCount(): void {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    if (w < 640) {
      this.visibleCount = 1;
      this.cardWidth = Math.min(w - 48, 300);
    } else if (w < 1024) {
      this.visibleCount = 2;
      this.cardWidth = 300;
    } else if (w < 1280) {
      this.visibleCount = 3;
      this.cardWidth = 320;
    } else {
      this.visibleCount = 4;
      this.cardWidth = 320;
    }
  }

  // Cálculos de Desplazamiento en Pixeles (GPU Offset)
  featuredOffset = computed(() => {
    const total = this.featuredProducts().length;
    if (total === 0) return 0;
    const step = this.cardWidth + this.cardGap;
    const maxOffset = Math.max(0, (total - this.visibleCount) * step);
    return Math.min(this.featuredSlideIndex() * step, maxOffset);
  });

  categoryOffset = computed(() => {
    const total = this.categories().length;
    if (total === 0) return 0;
    const step = this.cardWidth + this.cardGap;
    const maxOffset = Math.max(0, (total - this.visibleCount) * step);
    return Math.min(this.categorySlideIndex() * step, maxOffset);
  });

  // Conteo de Dots
  featuredDotsCount = computed(() => {
    const total = this.featuredProducts().length;
    return Math.max(1, total - this.visibleCount + 1);
  });

  categoryDotsCount = computed(() => {
    const total = this.categories().length;
    return Math.max(1, total - this.visibleCount + 1);
  });

  private startAutoSlides(): void {
    // 1. Auto-Slide de Productos Destacados (cada 4.5 segundos)
    this.featuredInterval = setInterval(() => {
      if (!this.isFeaturedHovered && !this.showCartDrawer()) {
        this.nextFeatured();
      }
    }, 4500);

    // 2. Auto-Slide de Categorías (cada 4 segundos)
    this.categoriesInterval = setInterval(() => {
      if (!this.isCategoriesHovered && !this.showCartDrawer()) {
        this.nextCategory();
      }
    }, 4000);
  }

  private stopAutoSlides(): void {
    if (this.featuredInterval) clearInterval(this.featuredInterval);
    if (this.categoriesInterval) clearInterval(this.categoriesInterval);
  }

  nextFeatured(): void {
    const max = this.featuredDotsCount() - 1;
    if (max <= 0) return;
    this.featuredSlideIndex.update(i => (i >= max ? 0 : i + 1));
  }

  prevFeatured(): void {
    const max = this.featuredDotsCount() - 1;
    if (max <= 0) return;
    this.featuredSlideIndex.update(i => (i <= 0 ? max : i - 1));
  }

  goToFeaturedSlide(index: number): void {
    this.featuredSlideIndex.set(index);
  }

  nextCategory(): void {
    const max = this.categoryDotsCount() - 1;
    if (max <= 0) return;
    this.categorySlideIndex.update(i => (i >= max ? 0 : i + 1));
  }

  prevCategory(): void {
    const max = this.categoryDotsCount() - 1;
    if (max <= 0) return;
    this.categorySlideIndex.update(i => (i <= 0 ? max : i - 1));
  }

  goToCategorySlide(index: number): void {
    this.categorySlideIndex.set(index);
  }

  pauseFeatured(): void {
    this.isFeaturedHovered = true;
  }

  resumeFeatured(): void {
    this.isFeaturedHovered = false;
  }

  pauseCategories(): void {
    this.isCategoriesHovered = true;
  }

  resumeCategories(): void {
    this.isCategoriesHovered = false;
  }

  async loadFeatured(): Promise<void> {
    this.isLoadingFeatured.set(true);
    try {
      const data = await this.productService.loadFeaturedProducts();
      this.featuredProducts.set(data || []);
    } catch (e) {
      console.error('Error cargando destacados:', e);
    } finally {
      this.isLoadingFeatured.set(false);
    }
  }

  async loadCategories(): Promise<void> {
    this.isLoadingCategories.set(true);
    try {
      const data = await this.categoryService.loadCategories();
      this.categories.set(data || []);
    } catch (e) {
      console.error('Error cargando categorías:', e);
    } finally {
      this.isLoadingCategories.set(false);
    }
  }

  getProductImageUrl(productId: number): string {
    return `http://localhost:8000/api/v1/products/${productId}/image`;
  }

  getCategoryImageUrl(categoryId: number): string {
    return `http://localhost:8000/api/v1/categories/${categoryId}/image`;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
    if (event.target.parentElement) {
      event.target.parentElement.innerHTML = `
        <div class="text-center p-6 text-slate-600">
          <i class="fas fa-box-open text-4xl mb-2 block text-slate-700"></i>
          <span class="text-[11px] font-medium text-slate-500">Sin Fotografía</span>
        </div>
      `;
    }
  }

  addToCart(product: ProductDto): void {
    this.cartService.addItem({
      id_producto: product.id_producto,
      nombre_producto: product.nombre_producto,
      precio: product.precio,
      descuento: product.descuento,
      tiene_imagen: product.tiene_imagen
    });

    this.toastMessage.set(`¡${product.nombre_producto} agregado al carrito!`);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 2500);
  }

  toggleCartDrawer(): void {
    this.showCartDrawer.update(v => !v);
  }
}
