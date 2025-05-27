import './scss/styles.scss';
import { ApiLarek } from './components/base/api';
import { Product } from './types/index';
import { EventEmitter } from './components/base/events';
import { CardItem } from './types/index';
// import { cloneTemplate } from './utils/utils';
import { IEventBus } from './types/index';

const api: ApiLarek = new ApiLarek();

class ProductModel {
	protected items: Product[] = [];

	constructor(protected api: ApiLarek) {}

	getAll(): Product[] {
		return this.items;
	}

	getById(id: string): Product | undefined {
		return this.items.find((item) => item.id === id);
	}

	async load(): Promise<void> {
		console.log('[model] загружаю товары...');
		try {
			this.items = await this.api.getProductList();
			console.log('[model] получено:', this.items);
		} catch (error) {
			console.error('[model] ошибка при загрузке товаров:', error);
		}
	}
}
class ProductPresenter {
	constructor(
		private container: HTMLElement,
		private template: HTMLTemplateElement,
		private model: ProductModel,
		private bus: IEventBus
	) {}

	async init() {
		await this.model.load();
		const products = this.model.getAll();
		this.render(products);

		this.bus.on('product:open', (id: string) => {
			const product = this.model.getById(id);
			if (!product) return;

			const template = document.querySelector(
				'#card-preview'
			) as HTMLTemplateElement;
			const modal = new CardItem(template, this.bus).update(product);

			const modalContent = document.querySelector(
				'.modal__content'
			) as HTMLElement;
			modalContent.innerHTML = '';
			modalContent.append(modal);

			const modalContainer = document.querySelector(
				'#modal-container'
			) as HTMLElement;
			modalContainer.classList.add('modal_active');
		});
	}

	private render(products: Product[]) {
		console.log('rendering products:', products);
		this.container.innerHTML = '';
		products.forEach((product) => {
			const card = new CardItem(this.template, this.bus).update(product);
			this.container.appendChild(card);
		});
	}
}

const bus = new EventEmitter();
const model = new ProductModel(api);

const container = document.querySelector('.gallery') as HTMLElement;
const template = document.querySelector('#card-catalog') as HTMLTemplateElement;

const presenter = new ProductPresenter(container, template, model, bus);
presenter.init();
