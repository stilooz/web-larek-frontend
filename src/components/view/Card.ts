import { Product } from '../../types';
import { EventEmitter } from '../base/events';
import { CDN_URL } from '../../utils/constants';

export class Card {
	public element: HTMLElement;
	private product: Product;
	private events: EventEmitter;

	constructor(product: Product, events: EventEmitter) {
		this.product = product;
		this.events = events;
		this.element = this.createCard();
		this.element.addEventListener('click', () => {
			this.events.emit('card:select', this.product);
		});
	}

	createCard(): HTMLElement {
		const template = document.getElementById(
			'card-catalog'
		) as HTMLTemplateElement;
		const card = template.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;
		const category = card.querySelector('.card__category') as HTMLElement;
		const image = card.querySelector('.card__image') as HTMLImageElement;
		const title = card.querySelector('.card__title') as HTMLElement;
		const price = card.querySelector('.card__price') as HTMLElement;

		category.textContent = this.product.category;
		const categoryMap: Record<Product['category'], string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			другое: 'other',
			кнопка: 'button',
			дополнительное: 'additional',
			фреймворк: 'framework',
		};
		const categoryClass = categoryMap[this.product.category] ?? 'other';
		category.classList.add(`card__category_${categoryClass}`);

		image.src = `${CDN_URL}/${this.product.image}`;
		image.alt = this.product.title;

		title.textContent = this.product.title;
		price.textContent = this.product.price
			? `${this.product.price} синапсов`
			: 'Бесценно';

		const button = card.querySelector('.card__button') as HTMLElement;
		if (button) {
			button.addEventListener('click', (evt) => {
				evt.stopPropagation();
				this.events.emit('card:buy', this.product);
			});
		}

		return card;
	}
}
