import { Product } from '../../types';

export class CardPreview {
	public element: HTMLElement;

	constructor(product: Product) {
		const template = document.getElementById(
			'card-preview'
		) as HTMLTemplateElement;
		const card = template.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;

		card
			.querySelector('.card__image')!
			.setAttribute(
				'src',
				`https://larek-api.nomoreparties.co/content/weblarek/${product.image}`
			);
		card.querySelector('.card__image')!.setAttribute('alt', product.title);
		card.querySelector('.card__title')!.textContent = product.title;
		card.querySelector('.card__text')!.textContent = product.description;
		card.querySelector('.card__category')!.textContent = product.category;
		card.querySelector('.card__price')!.textContent = product.price
			? `${product.price} синапсов`
			: 'Бесценно';

		this.element = card;
	}
}
