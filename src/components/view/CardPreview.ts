import { Product } from '../../types';
import { BaseCard } from './Card';

export class CardPreview extends BaseCard {
	private productId: string;
	private price: number | string | null;

	constructor(product: Product) {
		super(product, 'card-preview');

		const description = this.element.querySelector('.card__text');
		if (description) description.textContent = product.description;

		this.productId = product.id;
		this.price = product.price;

		if (this.button && typeof product.price !== 'number') {
			this.button.disabled = true;
		}

		if (this.button) {
			this.button.addEventListener('click', () => {
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
