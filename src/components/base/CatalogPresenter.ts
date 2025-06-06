import { Product } from '../../types';
import { EventEmitter } from './events';
import { ApiModel } from '../model/ApiModel';
import { Card } from '../view/Card';

export class CatalogPresenter {
	public items: Product[] = [];

	constructor(
		private apiModel: ApiModel,
		private catalogRoot: HTMLElement,
		private events: EventEmitter
	) {}

	async init() {
		this.items = await this.apiModel.getListProductCard();
		this.renderCatalog(this.items);
	}

	private renderCatalog(products: Product[]) {
		this.catalogRoot.innerHTML = '';
		products.forEach((product) => {
			const card = new Card(product, this.events);
			this.catalogRoot.append(card.element);
		});
	}
}
