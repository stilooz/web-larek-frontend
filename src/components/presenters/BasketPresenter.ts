import { Product } from '../../types';
import { EventEmitter } from '../base/events';
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
			this.events.emit('modal:open', this.view.render(this.model.getItems()));
		});

		this.model.events.on('basket:changed', (items: Product[]) => {
			this.view.render(items);
			if (typeof window !== 'undefined' && (window as any).currentCardPreview) {
				const productId = (window as any).currentCardPreview.productId;
				if (productId) {
					this.updateCardPreviewButton(items, productId);
				}
			}
		});
	}

	private updateCardPreviewButton(items: Product[], productId: string) {
		if (!productId) return;

		const cardContainer = this.modalContainer?.querySelector('.card') as HTMLElement | null;
		const cardButton = cardContainer?.querySelector('.card__button') as HTMLButtonElement | null;
		const cardTitle = cardContainer?.querySelector('.card__title') as HTMLElement | null;

		if (!cardContainer || !cardButton || !cardTitle) return;

		const isInBasket = items.some((item) => item.id === productId);
		cardButton.textContent = 'Купить';
		cardButton.disabled = isInBasket;

		const newButton = cardButton.cloneNode(true) as HTMLButtonElement;
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
		cardButton.replaceWith(newButton);
	}
}
