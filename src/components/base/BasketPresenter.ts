import { Product } from '../../types';
import { EventEmitter } from './events';
import { BasketModel } from '../model/BasketModel';
import { Basket } from '../view/Basket';
import { Success } from '../view/Success';

export class BasketPresenter {
	private model: BasketModel;
	private view: Basket;
	private events: EventEmitter;

	constructor(model: BasketModel, view: Basket, events: EventEmitter) {
		this.model = model;
		this.view = view;
		this.events = events;

		this.subscribeEvents();
	}

	private subscribeEvents() {
		this.events.on('card:buy', (product: Product) => {
			this.model.addItem(product);
		});

		this.events.on(
			'basket:add',
			(event: { id: string; catalog: Product[] }) => {
				const product = event.catalog.find((p) => p.id === event.id);
				if (product) {
					this.model.addItem(product);
				}
			}
		);

		this.events.on('basket:remove', (payload: { id: string }) => {
			this.model.removeItem(payload.id);
			this.view.render(this.model.getItems());
			this.updateCounter(this.model.getItems().length);
			this.updateCardPreviewButton(this.model.getItems());
		});

		this.events.on('basket:clear', () => {
			this.model.clear();
		});

		this.events.on('basket:open', () => {
			this.view.open();
		});

		this.events.on(
			'order:submit',
			(payload?: { email?: string; phone?: string }) => {
				this.events.emit('modal:close');

				if (!payload || !payload.email) {
					this.events.emit('order:open');
					return;
				}

				const total = this.model
					.getItems()
					.reduce(
						(sum, item: Product & { price?: number }) =>
							sum + (item.price ?? 0),
						0
					);

				this.model.clear();
				this.updateCounter(0);

				const successModal = new Success(this.events, total).render();
				this.events.emit('modal:open', successModal);
			}
		);

		this.model.events.on('basket:changed', (items: Product[]) => {
			this.view.render(items);
			this.updateCounter(Array.isArray(items) ? items.length : 0);
			this.updateCardPreviewButton(items);
		});
	}

	private updateCardPreviewButton(items: Product[]) {
		const modal = document.querySelector('.modal');
		if (!modal || !modal.classList.contains('modal_active')) return;

		const card = modal.querySelector('.card');
		if (!card) return;

		const button = card.querySelector('.card__button') as HTMLButtonElement;
		const titleEl = card.querySelector('.card__title');
		if (!button || !titleEl) return;

		const productId = titleEl.getAttribute('data-id');
		if (!productId) return;

		const isInBasket = items.some((item) => item.id === productId);
		button.textContent = 'Купить';
		button.disabled = isInBasket;

		const newButton = button.cloneNode(true) as HTMLButtonElement;
		if (!isInBasket) {
			newButton.addEventListener('click', () => {
				this.events.emit('basket:add', { id: productId });
			});
		}
		button.replaceWith(newButton);
	}

	private updateCounter(count: number) {
		const counterEl = document.querySelector('.header__basket-counter');
		if (!counterEl) return;

		counterEl.textContent = count.toString();
		if (count > 0) {
			counterEl.classList.add('basket__counter--visible');
		} else {
			counterEl.classList.remove('basket__counter--visible');
		}
	}
}
