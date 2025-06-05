import type { Product } from '../../types';

export class DataModel {
	private products: Product[] = [];
	private preview: Product | null = null;

	setProducts(items: Product[]) {
		this.products = items;
	}

	getProducts(): Product[] {
		return this.products;
	}

	setPreview(item: Product) {
		this.preview = item;
	}

	getPreview(): Product | null {
		return this.preview;
	}
}
