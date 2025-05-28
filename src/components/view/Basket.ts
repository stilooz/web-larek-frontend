import { CartItem } from '../../types';
import { createElement } from '../../utils/utils';

export class Basket {
	private _itemsContainer: HTMLElement;
	private _totalElement: HTMLElement;
	private _wrapper: HTMLElement;

	constructor(wrapperSelector: string = '#basket-view') {
		this._wrapper = document.querySelector(wrapperSelector)!;
		this._itemsContainer = this._wrapper.querySelector('.basket__items')!;
		this._totalElement = this._wrapper.querySelector('.basket__total-price')!;
	}

	render(items: CartItem[]) {
		this._itemsContainer.innerHTML = '';

		items.forEach(({ product }) => {
			const item = createElement(
				'div',
				{
					className: 'basket__item',
					dataset: { id: product.id },
				},
				[
					createElement('span', { className: 'basket__title' }, product.title),
					createElement(
						'span',
						{ className: 'basket__price' },
						`${product.price}₽`
					),
				]
			);

			this._itemsContainer.append(item);
		});

		const total = items.reduce(
			(sum, { product }) => sum + (product.price ?? 0),
			0
		);
		this._totalElement.textContent = `${total}₽`;
	}
}
