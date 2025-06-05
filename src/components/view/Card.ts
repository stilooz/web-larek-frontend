import { Product } from '../../types';
import { EventEmitter } from '../base/events';

export class Card {
	public element: HTMLElement;

	constructor(product: Product, events: EventEmitter) {
		const card = document.createElement('div');
		card.classList.add('card');
		card.setAttribute('data-id', product.id);

		const categoryMap: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			другое: 'other',
			кнопка: 'button',
			дополнительное: 'additional',
			фреймворк: 'framework',
		};

		const rawCategory = product.category;
		const mappedCategory = categoryMap[rawCategory] || 'other';

		const category = document.createElement('div');
		category.classList.add(
			'card__category',
			`card__category_${mappedCategory}`
		);
		category.textContent = rawCategory;

		const title = document.createElement('h3');
		title.classList.add('card__title');
		title.textContent = product.title;

		const info = document.createElement('div');
		info.classList.add('card__info');
		info.append(category, title);

		const image = document.createElement('img');
		image.classList.add('card__image');
		image.src = `https://larek-api.nomoreparties.co/content/weblarek/${product.image}`;
		image.alt = product.title;

		const price = document.createElement('p');
		price.classList.add('card__price');
		price.textContent = `${product.price} синапсов`;

		card.append(info, image, price);

		card.addEventListener('click', () => {
			events.emit('card:select', { product });
		});

		this.element = card;
	}
}
