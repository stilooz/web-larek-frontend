import { BasketModel } from '../model/BasketModel';
import { Product } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CardPreview {
	public element: HTMLElement;
	private button: HTMLButtonElement | null = null;
	private productId: string;
	private price: number | string | null;

	constructor(product: Product) {
		const template = document.getElementById(
			'card-preview'
		) as HTMLTemplateElement;

		if (!template) {
			throw new Error('Шаблон #card-preview не найден в index.html');
		}

		const card = template.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;

		(
			card.querySelector('.card__image') as HTMLImageElement
		).src = `${CDN_URL}/${product.image}`;
		(card.querySelector('.card__image') as HTMLImageElement).alt =
			product.title;

		const title = card.querySelector('.card__title');
		if (title) title.textContent = product.title;

		const description = card.querySelector('.card__text');
		if (description) description.textContent = product.description;

		const category = card.querySelector('.card__category');
		if (category) category.textContent = product.category;

		const price = card.querySelector('.card__price');
		if (price) {
			price.textContent =
				product.price !== null &&
				product.price !== undefined &&
				product.price !== 0
					? `${product.price} синапсов`
					: 'Бесценно';
		}

		this.button = card.querySelector('.card__button') as HTMLButtonElement;
		if (this.button && typeof product.price !== 'number') {
			this.button.disabled = true;
		}

		this.element = card;
		this.productId = product.id;
		this.price = product.price;

		if (this.button) {
			this.button.addEventListener('click', () => {
				console.log('CardPreview emitting basket:add for id:', product.id);
				document.dispatchEvent(
					new CustomEvent('basket:add', {
						detail: { id: product.id },
					})
				);
			});
		}
	}

	public updateButton(basketItems: Product[]) {
		if (!this.button) return;
		if (typeof this.price !== 'number') {
			this.button.disabled = true;
			return;
		}

		const isInBasket = basketItems.some((item) => item.id === this.productId);
		this.button.textContent = 'Купить';
		this.button.disabled = isInBasket;
	}
}
