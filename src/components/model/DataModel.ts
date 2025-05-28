import { Product } from '../../types';

export class DataModel {
	private items: Product[] = [];

	setItems(items: Product[]) {
		this.items = items;
	}

	getItems() {
		return this.items;
	}
}
