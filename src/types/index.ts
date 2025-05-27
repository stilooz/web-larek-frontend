import { cloneTemplate } from '../utils/utils';

export class CardItem {
	protected layout: HTMLElement;
	protected bus: IEventBus;
	protected id: string;

	protected titleElement: HTMLElement;
	protected textElement: HTMLElement;
	protected imageElement: HTMLImageElement;
	protected priceElement: HTMLElement;

	constructor(template: HTMLTemplateElement, bus: IEventBus) {
		this.layout = cloneTemplate(template);
		this.bus = bus;

		this.titleElement = this.layout.querySelector('.card__title');
		this.textElement = this.layout.querySelector('.card__text'); // если элемент существует
		this.imageElement = this.layout.querySelector('.card__image');
		this.priceElement = this.layout.querySelector('.card__price');

		this.layout.addEventListener('click', () => {
			this.bus.emit('product:open', this.id);
		});
	}

	update(product: Product): HTMLElement {
		console.log('creating card:', product);
		this.id = product.id;
		this.titleElement.textContent = product.title;
		if (this.textElement) {
			this.textElement.textContent = product.description;
		}
		this.imageElement.src = product.image;
		this.priceElement.textContent = product.price
			? `${product.price} синапсов`
			: 'Нет в наличии';

		this.layout.dataset.id = product.id;

		return this.layout;
	}
}
export interface Product {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
}
export interface IEventBus {
	emit(event: string, payload?: unknown): void;
	on(event: string, callback: (payload?: unknown) => void): void;
}
