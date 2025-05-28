import { CartItem, Product } from '../../types';
import { createElement } from '../../utils/utils';

export class Basket {
	private _itemsContainer: HTMLElement;
	private _totalElement: HTMLElement;
	private _wrapper: HTMLElement;
	private _items: CartItem[] = [];

	public constructor(wrapperSelector = '.basket') {
		this._wrapper = document.querySelector(wrapperSelector) as HTMLElement;

		const items = this._wrapper.querySelector('.basket__list');
		if (!items) throw new Error('Basket items container not found');
		this._itemsContainer = items as HTMLElement;

		const total = this._wrapper.querySelector('.basket__price');
		if (!total) throw new Error('Basket total element not found');
		this._totalElement = total as HTMLElement;
	}

	public setItems(items: CartItem[]) {
		this._items = items;
		this.render();
	}

	public addItem(item: CartItem) {
		this._items.push(item);
		this.render();
	}

	public removeItem(index: number) {
		this._items.splice(index, 1);
		this.render();
	}

	public render() {
		this._itemsContainer.innerHTML = '';

		this._items.forEach(({ product }, index) => {
			const item = createElement(
				'li',
				{
					className: 'basket__item card card_compact',
					dataset: { id: product.id },
				},
				[]
			);

			const indexSpan = createElement('span', {
				className: 'basket__item-index',
			});
			indexSpan.textContent = (index + 1).toString();

			const titleSpan = createElement('span', { className: 'card__title' });
			titleSpan.textContent = product.title;

			const priceSpan = createElement('span', { className: 'card__price' });
			priceSpan.textContent = `${product.price.toLocaleString()} синапсов`;

			const deleteButton = createElement('button', {
				className: 'basket__item-delete card__button',
				ariaLabel: 'удалить',
			});
			deleteButton.addEventListener('click', () => this.removeItem(index));

			item.append(indexSpan, titleSpan, priceSpan, deleteButton);
			this._itemsContainer.appendChild(item);
		});

		const total = this._items.reduce(
			(sum, { product }) => sum + (product.price ?? 0),
			0
		);
		this._totalElement.textContent = `${total.toLocaleString()} синапсов`;
	}
}
