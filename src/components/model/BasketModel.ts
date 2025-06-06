import { Product } from '../../types';
import { EventEmitter } from '../base/events';

export class BasketModel {
	public items: Product[] = [];

	constructor(public events: EventEmitter) {}

	addItem(product: Product) {
		const exists = this.items.find((item) => item.id === product.id);
		if (!exists) {
			this.items.push(product);
			this.events.emit('basket:changed', [...this.items]);
		}
	}

	removeItem(productId: string) {
		this.items = this.items.filter((item) => item.id !== productId);
		this.events.emit('basket:changed', [...this.items]);
	}

	getItems(): Product[] {
		return [...this.items];
	}

	clear() {
		this.items = [];
		this.events.emit('basket:changed', []);
	}
}
