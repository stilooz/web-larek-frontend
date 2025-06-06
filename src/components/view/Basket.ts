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

	constructor(private events: EventEmitter) {
		const basketTemplate = document.getElementById(
			'basket'
		) as HTMLTemplateElement;
		const basket = basketTemplate.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;

		this.element = basket;
		this.container = basket;
		this.list = basket.querySelector('.basket__list')!;
		this.price = basket.querySelector('.basket__price')!;
		this.button = basket.querySelector('.basket__button')!;
		this.template = document.getElementById(
			'card-basket'
		) as HTMLTemplateElement;
		this.counter = document.querySelector('.header__basket-counter')!;

		this.button.addEventListener('click', () => {
			this.events.emit('order:submit');
		});

		document.body.appendChild(basket);

		this.events.on('basket:changed', (items) => {
			if (!Array.isArray(items)) {
				console.error('basket:changed received non-array:', items);
				return;
			}
			this.items = items;
			this.render(items);
		});
	}

	render(items: Product[]) {
		this.list.innerHTML = '';

		let total = 0;
		items.forEach((product, index) => {
			const item = this.template.content.firstElementChild!.cloneNode(
				true
			) as HTMLElement;
			item.querySelector('.basket__item-index')!.textContent = String(
				index + 1
			);
			item.querySelector('.card__title')!.textContent = product.title;
			item.querySelector('.card__price')!.textContent = product.price
				? `${product.price} синапсов`
				: 'Бесценно';
			total += product.price ?? 0;
			item
				.querySelector('.basket__item-delete')
				?.addEventListener('click', () => {
					this.events.emit('basket:remove', product);
				});

			this.list.appendChild(item);
		});

		this.price.textContent = `${total} синапсов`;
		this.button.disabled = items.length === 0;

		this.counter.textContent = String(items.length);
		this.counter.classList.toggle('basket__counter--visible', items.length > 0);
	}

	getItems(): Product[] {
		return this.items;
	}
	open() {
		this.container.classList.add('modal_active');
	}
}
