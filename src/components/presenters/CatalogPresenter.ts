import { Product } from '../../types';
import { EventEmitter } from '../base/events';
import { ApiModel } from '../model/ApiModel';
import { StoreView } from '../view/StoreView';

export class CatalogPresenter {
	public items: Product[] = [];
	private view: StoreView;

	constructor(
		private apiModel: ApiModel,
		catalogRoot: HTMLElement,
		private events: EventEmitter
	) {
		this.view = new StoreView(catalogRoot, this.events);
	}

	async init() {
		this.items = await this.apiModel.getListProductCard();
		this.renderCatalog(this.items);
	}

	private renderCatalog(products: Product[]) {
		this.view.clearCatalog();
		this.view.renderCatalog(products);
	}
}
