import { Product } from '../../types';
import { EventEmitter } from '../base/events';

export class Card {
	public element: HTMLElement;

	constructor(product: Product, events: EventEmitter) {
		const card = document.createElement('div');
		card.className = 'card';
		card.setAttribute('data-id', product.id);

		card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="card__image">
      <h3 class="card__title">${product.title}</h3>
      <p class="card__price">${product.price} синапсов</p>
    `;

		card.addEventListener('click', () => {
			events.emit('card:select', { product });
		});

		this.element = card;
	}
}
