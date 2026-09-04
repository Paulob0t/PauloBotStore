import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  signal,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { ProductDto, CategoryDto } from '../../api/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      <!-- Navbar Superior de la Tienda -->
      <header class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20">
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

            <!-- Acciones Derecha: Admin & Carrito -->
            <div class="flex items-center gap-3 sm:gap-4">
              <a
                routerLink="/admin"
                class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 transition-all"
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
        <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-900 border border-indigo-500/20 p-8 sm:p-12 shadow-2xl">
          <div class="absolute -right-16 -bottom-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="relative z-10 max-w-2xl space-y-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
              <i class="fas fa-bolt text-amber-400"></i> Despacho Inteligente & Inmediato
            </div>
            <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Tus Snacks & Bebidas favoritas al instante
            </h1>
            <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explora nuestro catálogo con movimiento constante y fluido a 60 FPS. Selecciona lo que deseas y recógelo inmediatamente en el dispensador automatizado.
            </p>
          </div>
        </section>

        <!-- SECCIÓN 1: Carrusel de Productos Destacados (GPU Acelerado) -->
        <section class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <i class="fas fa-fire text-amber-400"></i> Selección Especial
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Ultra Fluido
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
                (click)="toggleFeaturedPause()"
                class="px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                title="Pausar / Reanudar movimiento"
              >
                <i class="fas" [ngClass]="isFeaturedPaused() ? 'fa-play text-emerald-400' : 'fa-pause text-amber-400'"></i>
                <span>{{ isFeaturedPaused() ? 'Reanudar' : 'Pausar' }}</span>
              </button>
            </div>
          </div>

          <!-- Pista del Carrusel de Productos con GPU Marquee -->
          @if (isLoadingFeatured()) {
            <div class="py-16 text-center text-slate-500">
              <i class="fas fa-spinner fa-spin text-3xl text-indigo-500 mb-3"></i>
              <p class="text-sm">Cargando productos destacados...</p>
            </div>
          } @else if (infiniteFeatured().length > 0) {
            <div class="relative overflow-hidden mask-carousel py-2">
              <div
                class="marquee-track flex gap-6"
                [class.is-paused]="isFeaturedPaused()"
                style="animation-duration: 40s;"
              >
                @for (product of infiniteFeatured(); track $index) {
                  <div class="w-72 sm:w-80 shrink-0 bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-5 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between group">
                    
                    <!-- Contenedor Imagen y Badges -->
                    <div class="space-y-4">
                      <div class="relative h-48 rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                        
                        <!-- Badge Destacado / Orden -->
                        <span class="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 backdrop-blur-md">
                          <i class="fas fa-star text-[9px]"></i> Top #{{ product.orden_destacado || 1 }}
                        </span>

                        <!-- Badge Descuento si aplica -->
                        @if (product.descuento && product.descuento > 0 && product.descuento < product.precio) {
                          <span class="absolute top-3 right-3 z-10 px-2 py-1 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                            ¡OFERTA!
                          </span>
                        }

                        <!-- Imagen o Fallback Placeholder -->
                        @if (product.tiene_imagen === 1) {
                          <img
                            [src]="getProductImageUrl(product.id_producto)"
                            [alt]="product.nombre_producto"
                            class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 pointer-events-none"
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
                    <div class="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-3">
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
                        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all cursor-pointer shrink-0"
                      >
                        <i class="fas fa-cart-plus"></i>
                        <span>Agregar</span>
                      </button>
                    </div>

                  </div>
                }
              </div>
            </div>
          } @else {
            <div class="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-sm">
              No hay productos destacados configurados en este momento.
            </div>
          }
        </section>

        <!-- SECCIÓN 2: Carrusel Infinito de Categorías (GPU Acelerado) -->
        <section class="space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <i class="fas fa-layer-group text-indigo-400"></i> Catálogo Completo
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Loop Infinito
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
                (click)="toggleCategoriesPause()"
                class="px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                title="Pausar / Reanudar movimiento"
              >
                <i class="fas" [ngClass]="isCategoriesPaused() ? 'fa-play text-emerald-400' : 'fa-pause text-amber-400'"></i>
                <span>{{ isCategoriesPaused() ? 'Reanudar' : 'Pausar' }}</span>
              </button>
            </div>
          </div>

          <!-- Pista del Carrusel de Categorías con GPU Marquee -->
          @if (isLoadingCategories()) {
            <div class="py-16 text-center text-slate-500">
              <i class="fas fa-spinner fa-spin text-3xl text-indigo-500 mb-3"></i>
              <p class="text-sm">Cargando categorías...</p>
            </div>
          } @else if (infiniteCategories().length > 0) {
            <div class="relative overflow-hidden mask-carousel py-2">
              <div
                class="marquee-track flex gap-6"
                [class.is-paused]="isCategoriesPaused()"
                style="animation-duration: 45s;"
              >
                @for (cat of infiniteCategories(); track $index) {
                  <div class="w-72 sm:w-80 h-96 shrink-0 relative rounded-3xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 shadow-xl group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                    
                    <!-- Fondo con Imagen Optimizada de Categoría o Gradiente -->
                    @if (cat.tiene_imagen === 1) {
                      <img
                        [src]="getCategoryImageUrl(cat.id)"
                        [alt]="cat.nombre"
                        class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none"
                        loading="lazy"
                      />
                    } @else {
                      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-950 flex items-center justify-center">
                        <i class="fas fa-tags text-7xl text-indigo-500/20 group-hover:scale-110 group-hover:text-indigo-500/30 transition-all duration-500"></i>
                      </div>
                    }

                    <!-- Overlay Oscuro Degradado -->
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

                    <!-- Contenido Superior: Badge de Subcategorías -->
                    <div class="absolute top-4 left-4 right-4 flex justify-between items-center">
                      <span class="px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-indigo-300 text-[11px] font-black uppercase tracking-wider">
                        {{ (cat.subcategorias?.length || 0) }} Subcategorías
                      </span>
                      <div class="w-8 h-8 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 flex items-center justify-center text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <i class="fas fa-arrow-up-right-from-square"></i>
                      </div>
                    </div>

                    <!-- Contenido Inferior: Título & Botón -->
                    <div class="absolute bottom-6 left-6 right-6 space-y-3">
                      <h3 class="text-2xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">
                        {{ cat.nombre }}
                      </h3>

                      @if (cat.subcategorias && cat.subcategorias.length > 0) {
                        <div class="flex flex-wrap gap-1.5 pt-1">
                          @for (sub of cat.subcategorias.slice(0, 3); track sub.id) {
                            <span class="px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[10px] font-semibold text-slate-300">
                              {{ sub.nombre }}
                            </span>
                          }
                          @if (cat.subcategorias.length > 3) {
                            <span class="px-1.5 py-0.5 rounded-lg bg-slate-800/60 text-[10px] text-slate-400">
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
          } @else {
            <div class="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-sm">
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
            class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
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
      <footer class="border-t border-slate-800/80 bg-slate-900/60 py-8 text-center text-xs text-slate-500">
        <p>PauloBot Store &copy; 2026 — Plataforma Inteligente Vending & Ecommerce Desacoplada</p>
      </footer>

    </div>
  `,
  styles: [`
    /* Animación Infinita Acelerada por Hardware (GPU 60-120 FPS sin lag de CPU) */
    @keyframes marqueeScroll {
      0% {
        transform: translate3d(0, 0, 0);
      }
      100% {
        transform: translate3d(-50%, 0, 0);
      }
    }

    .marquee-track {
      width: max-content;
      will-change: transform;
      animation-name: marqueeScroll;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }

    .marquee-track:hover,
    .marquee-track.is-paused {
      animation-play-state: paused !important;
    }

    /* Máscara suave degradada en extremos */
    .mask-carousel {
      mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);
      -webkit-mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  public cartService = inject(CartService);

  featuredProducts = signal<ProductDto[]>([]);
  categories = signal<CategoryDto[]>([]);
  
  isLoadingFeatured = signal<boolean>(true);
  isLoadingCategories = signal<boolean>(true);
  
  showCartDrawer = signal<boolean>(false);
  toastMessage = signal<string | null>(null);

  // Estados de pausa interactiva
  isFeaturedPaused = signal<boolean>(false);
  isCategoriesPaused = signal<boolean>(false);

  // Computados de Carrito
  readonly cartItems = this.cartService.items;
  readonly cartItemsCount = this.cartService.totalItems;
  readonly cartSubtotal = this.cartService.subtotal;

  // Exactamente 2 copias para un loop perfecto de 50% en CSS Marquee GPU
  readonly infiniteFeatured = computed(() => {
    const list = this.featuredProducts();
    if (list.length === 0) return [];
    return [...list, ...list];
  });

  readonly infiniteCategories = computed(() => {
    const list = this.categories();
    if (list.length === 0) return [];
    return [...list, ...list];
  });

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.loadFeatured(),
      this.loadCategories()
    ]);
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

  toggleFeaturedPause(): void {
    this.isFeaturedPaused.update(v => !v);
  }

  toggleCategoriesPause(): void {
    this.isCategoriesPaused.update(v => !v);
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
