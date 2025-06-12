import { EventEmitter } from '../base/events';
import type { Product } from '../../types';

export class Basket {
	public element: HTMLElement;
	public container: HTMLElement;
	private list: HTMLUListElement;
	private price: HTMLElement;
	private button: HTMLButtonElement;
	private template: HTMLTemplateElement;
	private counter: HTMLElement;
	private items: Product[] = [];

	constructor(
		private events: EventEmitter,
		basketTemplate: HTMLTemplateElement,
		cardBasketTemplate: HTMLTemplateElement,
		basketCounter: HTMLElement
	) {
		const container = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

		this.element = container;
		this.container = container;
		this.list = container.querySelector('.basket__list')!;
		this.price = container.querySelector('.basket__price')!;
		this.button = container.querySelector('.basket__button')!;
		this.template = cardBasketTemplate;
		this.counter = basketCounter;

		this.button.addEventListener('click', () => {
			this.events.emit('order:submit');
		});
	}

	render(items: Product[] = []): HTMLElement {
		if (!Array.isArray(items)) {
			console.error('Basket.render(): items is not array:', items);
			items = [];
		}
		this.items = items;
		this.list.innerHTML = '';

		let total = 0;
		items.forEach((product, index) => {
			const item = this.renderItem(product, index);
			this.list.appendChild(item);
			total += product.price ?? 0;
		});

		this.price.textContent = `${total} синапсов`;
		this.button.disabled = items.length === 0;

		this.counter.textContent = String(items.length);
		this.counter.classList.toggle('basket__counter--visible', items.length > 0);

		this.list.classList.toggle('basket__list_empty', items.length === 0);

		return this.container;
	}

	private renderItem(product: Product, index: number): HTMLElement {
		const item = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		const indexElement = item.querySelector('.basket__item-index') as HTMLElement;
		const titleElement = item.querySelector('.card__title') as HTMLElement;
		const priceElement = item.querySelector('.card__price') as HTMLElement;
		const deleteButton = item.querySelector('.basket__item-delete') as HTMLElement;

		item.classList.add('basket__item', 'card', 'card_compact');

		if (indexElement) indexElement.textContent = String(index + 1);
		if (titleElement) titleElement.textContent = product.title;
		if (priceElement)
			priceElement.textContent = product.price
				? `${product.price} синапсов`
				: 'Бесценно';

		if (deleteButton) {
			deleteButton.setAttribute('data-id', String(product.id));
			deleteButton.addEventListener('click', () => {
				const id = deleteButton.dataset.id;
				if (id) {
					this.events.emit('basket:remove', { id });
				}
			});
		}

		return item;
	}

	getItems(): Product[] {
		return [...this.items];
	}

	open() {
		this.events.emit('modal:open', this.container);
	}

	close() {
		this.events.emit('modal:close');
	}
}
