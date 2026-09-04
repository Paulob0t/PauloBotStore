import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id_producto: number;
  nombre_producto: string;
  precio: number;
  descuento?: number | null;
  precio_final: number;
  cantidad: number;
  tiene_imagen?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'paulobot_store_cart';
  private itemsSignal = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this.itemsSignal.asReadonly();

  readonly totalItems = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.cantidad, 0)
  );

  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.precio_final * item.cantidad, 0)
  );

  constructor() {}

  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error guardando carrito en localStorage:', e);
    }
  }

  addItem(product: {
    id_producto: number;
    nombre_producto: string;
    precio: number;
    descuento?: number | null;
    tiene_imagen?: number;
  }): void {
    const finalPrice = product.descuento && product.descuento > 0 ? product.descuento : product.precio;

    this.itemsSignal.update(currentItems => {
      const index = currentItems.findIndex(i => i.id_producto === product.id_producto);
      let updated: CartItem[];

      if (index > -1) {
        updated = currentItems.map((item, i) =>
          i === index ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        updated = [
          ...currentItems,
          {
            id_producto: product.id_producto,
            nombre_producto: product.nombre_producto,
            precio: product.precio,
            descuento: product.descuento,
            precio_final: finalPrice,
            cantidad: 1,
            tiene_imagen: product.tiene_imagen
          }
        ];
      }

      this.saveToStorage(updated);
      return updated;
    });
  }

  removeItem(productId: number): void {
    this.itemsSignal.update(items => {
      const updated = items.filter(i => i.id_producto !== productId);
      this.saveToStorage(updated);
      return updated;
    });
  }

  updateQuantity(productId: number, qty: number): void {
    if (qty <= 0) {
      this.removeItem(productId);
      return;
    }

    this.itemsSignal.update(items => {
      const updated = items.map(item =>
        item.id_producto === productId ? { ...item, cantidad: qty } : item
      );
      this.saveToStorage(updated);
      return updated;
    });
  }

  clear(): void {
    this.itemsSignal.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
