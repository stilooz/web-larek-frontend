import { EventEmitter } from '../base/events';
import { ApiModel } from '../model/ApiModel';
import { BasketModel } from '../model/BasketModel';
import { FormOrder } from '../view/FormOrder';
import { FormContacts } from '../view/FormContacts';
import { Success } from '../view/Success';
import type { DeliveryData, ContactData } from '../../types';
import { validateContactData } from '../model/FormModel';

export class OrderPresenter {
	private api: ApiModel;
	private successView: Success;

	constructor(
		private events: EventEmitter,
		private model: BasketModel,
		private modalContainer: HTMLElement
	) {
		this.api = new ApiModel();
		new FormOrder(this.events, this.modalContainer);
		new FormContacts(this.events, this.modalContainer);
		this.successView = new Success(this.events, 0);
		this.subscribeEvents();
	}

	private subscribeEvents(): void {
		this.events.on('delivery:submit', (deliveryData: DeliveryData) => {
			this.model.setDeliveryData(deliveryData);
		});

		this.events.on('contacts:submit', async (contactData: ContactData) => {
			this.events.emit('modal:close');

			const items = this.model.getItems();
			const deliveryData = this.model.getDeliveryData();
			if (!deliveryData) {
				this.events.emit('order:error', {
					message: 'Данные доставки не найдены',
				});
				return;
			}

			try {
				await this.api.postOrderLot({
					items,
					delivery: deliveryData,
					contacts: contactData,
				});
			} catch (error) {
				this.events.emit('order:error', {
					message: 'Не удалось отправить заказ',
				});
				return;
			}

			const total = this.model.getTotal();
			this.model.clear();
			this.model.clearDeliveryData();

			this.successView.setTotal(total);
			this.events.emit('modal:open', this.successView.render());
		});

		this.events.on(
			'order:submit',
			(payload?: { email?: string; phone?: string }) => {
				this.events.emit('modal:close');

				if (!payload || !validateContactData(payload as ContactData)) {
					this.events.emit('order:open');
					return;
				}

				const total = this.model.getTotal();

				this.model.clear();
				this.model.clearDeliveryData();

				this.successView.setTotal(total);
				this.events.emit('modal:open', this.successView.render());
			}
		);
	}
}
