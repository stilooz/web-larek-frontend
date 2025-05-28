import { IProductItem } from '../../types';
import { cloneTemplate } from '../../utils/utils';

export class Card {
	private _element: HTMLElement;
	private _data: IProductItem;

	constructor(
		product: IProductItem,
		templateSelector: string = '#card-catalog'
	) {
		this._data = product;
		this._element = this._createCard(templateSelector);
	}

	private _createCard(templateSelector: string): HTMLElement {
		const card = cloneTemplate<HTMLDivElement>(templateSelector);

		const title = card.querySelector('.card__title');
		const image = card.querySelector('.card__image') as HTMLImageElement;
		const category = card.querySelector('.card__category');
		const price = card.querySelector('.card__price');

		if (title) title.textContent = this._data.title;
		if (category) category.textContent = this._data.category;
		if (price)
			price.textContent = this._data.price
				? `${this._data.price}₽`
				: 'Бесценно';
		if (image) {
			image.src = this._data.image;
			image.alt = this._data.title;
		}

		card.dataset.id = this._data.id;

		return card;
	}

	get element(): HTMLElement {
		return this._element;
	}
}
