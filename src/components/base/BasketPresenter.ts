import { Product } from '../../types';
import { EventEmitter } from './events';
import { BasketModel } from '../model/BasketModel';
import { Basket } from '../view/Basket';
import { Success } from '../view/Success';

export class BasketPresenter {
	private model: BasketModel;
	private view: Basket;
	private events: EventEmitter;

	private modalContainer = document.querySelector('.modal') as HTMLElement;
	private cardContainer = this.modalContainer?.querySelector(
		'.card'
	) as HTMLElement;
	private cardButton = this.cardContainer?.querySelector(
		'.card__button'
	) as HTMLButtonElement;
	private cardTitle = this.cardContainer?.querySelector(
		'.card__title'
	) as HTMLElement;

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
					.reduce((sum, item) => sum + (item.price ?? 0), 0);

				this.model.clear();

				const successModal = new Success(this.events, total).render();
				this.events.emit('modal:open', successModal);
			}
		);

		this.model.events.on('basket:changed', (items: Product[]) => {
			this.view.render(items);
			this.updateCardPreviewButton(items);
		});
	}

	private updateCardPreviewButton(items: Product[]) {
		if (
			!this.modalContainer ||
			!this.modalContainer.classList.contains('modal_active')
		)
			return;
		if (!this.cardContainer || !this.cardButton || !this.cardTitle) return;

		const productId = this.cardTitle.getAttribute('data-id');
		if (!productId) return;

		const isInBasket = items.some((item) => item.id === productId);
		this.cardButton.textContent = 'Купить';
		this.cardButton.disabled = isInBasket;

		const newButton = this.cardButton.cloneNode(true) as HTMLButtonElement;
		if (!isInBasket) {
			newButton.addEventListener('click', () => {
				const product = this.model
					.getItems()
					.find((item) => item.id === productId);
				if (product) {
					this.events.emit('card:buy', product);
				}
			});
		}
		this.cardButton.replaceWith(newButton);
	}
}
