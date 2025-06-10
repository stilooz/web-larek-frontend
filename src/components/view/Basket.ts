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
		const container = basketTemplate.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;

		this.element = container;
		this.container = container;
		this.list = container.querySelector('.basket__list')!;
		this.price = container.querySelector('.basket__price')!;
		this.button = container.querySelector('.basket__button')!;
		const basketTemplateCheck = document.getElementById('card-basket');
		if (!basketTemplateCheck) {
			console.error('шаблон не найден');
		}
		this.template = document.getElementById(
			'card-basket'
		) as HTMLTemplateElement;
		this.counter = document.querySelector('.header__basket-counter')!;

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
			const item = this.template.content.firstElementChild!.cloneNode(
				true
			) as HTMLElement;
			item.classList.add('card');
			item.querySelector('.basket__item-index')!.textContent = String(
				index + 1
			);
			item.querySelector('.card__title')!.textContent = product.title;
			item.querySelector('.card__price')!.textContent = product.price
				? `${product.price} синапсов`
				: 'Бесценно';
			total += product.price ?? 0;
			const deleteButton = item.querySelector('.basket__item-delete');
			if (deleteButton) {
				deleteButton.setAttribute('data-id', String(product.id));
				deleteButton.addEventListener('click', () => {
					const id = (deleteButton as HTMLElement).dataset.id;
					if (id) {
						this.events.emit('basket:remove', { id });
					}
				});
			}

			this.list.appendChild(item);
		});

		this.price.textContent = `${total} синапсов`;
		this.button.disabled = items.length === 0;

		this.counter.textContent = String(items.length);
		this.counter.classList.toggle('basket__counter--visible', items.length > 0);

		return this.container;
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
