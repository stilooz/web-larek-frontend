import { IProductItem } from '../../types';

export class DataModel {
	private items: IProductItem[] = [];

	setItems(items: IProductItem[]) {
		this.items = items;
	}

	getItems() {
		return this.items;
	}
}
