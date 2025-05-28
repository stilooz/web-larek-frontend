import { CartItem, Product } from '../../types';

export class BasketModel {
	private _items: CartItem[] = [];

	add(product: Product) {
		if (!this._items.find((item) => item.product.id === product.id)) {
			this._items.push({ product });
		}
	}

	remove(productId: string) {
		this._items = this._items.filter((item) => item.product.id !== productId);
	}

	clear() {
		this._items = [];
	}

	getItems(): CartItem[] {
		return this._items;
	}

	getTotal(): number {
		return this._items.reduce(
			(sum, { product }) => sum + (product.price ?? 0),
			0
		);
	}
}
