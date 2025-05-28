import { Product } from '../../types';
import { cloneTemplate } from '../../utils/utils';

export class CardPreview {
	private _element: HTMLElement;

	constructor(product: Product, templateSelector = '#card-preview') {
		this._element = this._createPreview(product, templateSelector);
	}

	private _createPreview(
		product: Product,
		templateSelector: string
	): HTMLElement {
		const preview = cloneTemplate<HTMLDivElement>(templateSelector);

		const title = preview.querySelector('.preview__title');
		const image = preview.querySelector('.preview__image') as HTMLImageElement;
		const description = preview.querySelector('.preview__description');
		const category = preview.querySelector('.preview__category');
		const price = preview.querySelector('.preview__price');
		const button = preview.querySelector('.preview__button');

		if (title) title.textContent = product.title;
		if (description) description.textContent = product.description;
		if (category) category.textContent = product.category;
		if (price)
			price.textContent = product.price ? `${product.price}₽` : 'Бесценно';
		if (image) {
			image.src = product.image;
			image.alt = product.title;
		}
		if (button instanceof HTMLElement) {
			button.dataset.id = product.id;
		}
		return preview;
	}

	get element(): HTMLElement {
		return this._element;
	}
}
