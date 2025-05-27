// src/components/CardItem.ts

import { Product } from '../types';
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

		this.titleElement = this.layout.querySelector('.product__title');
		this.textElement = this.layout.querySelector('.product__text');
		this.imageElement = this.layout.querySelector('.product__image');
		this.priceElement = this.layout.querySelector('.product__price');

		this.layout.addEventListener('click', () => {
			this.bus.emit('product:open', this.id);
		});
	}

	update(product: Product): HTMLElement {
		this.id = product.id;
		this.titleElement.textContent = product.title;
		this.textElement.textContent = product.description;
		this.imageElement.src = product.image;
		this.priceElement.textContent = product.price
			? `${product.price}₽`
			: 'Нет в наличии';

		return this.layout;
	}
}

export interface IEventBus {
	emit(event: string, payload?: unknown): void;
	on(event: string, callback: (payload?: unknown) => void): void;
}
