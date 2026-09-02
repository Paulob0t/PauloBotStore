import { Injectable, signal } from '@angular/core';
import { Api } from '../../api/api';
import { getCategories } from '../../api/functions';
import { CategoryDto } from '../../api/models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSignal = signal<CategoryDto[]>([]);
  private loadingSignal = signal<boolean>(false);

  readonly categories = this.categoriesSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();

  constructor(private api: Api) {}

  async loadCategories(): Promise<CategoryDto[]> {
    this.loadingSignal.set(true);
    try {
      const data = await this.api.invoke(getCategories, {});
      this.categoriesSignal.set(data || []);
      return data || [];
    } catch (error) {
      console.error('Error cargando categorías:', error);
      return [];
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
