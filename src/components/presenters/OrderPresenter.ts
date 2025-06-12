import { EventEmitter } from '../base/events';
import { ApiModel } from '../model/ApiModel';
import { BasketModel } from '../model/BasketModel';
import { FormOrder } from '../view/FormOrder';
import { FormContacts } from '../view/FormContacts';
import { Success } from '../view/Success';
import type { DeliveryData, ContactData } from '../../types';
import { FormModel } from '../model/FormModel';

export class OrderPresenter {
	private api: ApiModel;
	private deliveryData: DeliveryData | null = null;

	constructor(
		private events: EventEmitter,
		private model: BasketModel,
		private modalContainer: HTMLElement
	) {
		this.api = new ApiModel();
		new FormOrder(this.events, this.modalContainer);
		new FormContacts(this.events, this.modalContainer);
		this.subscribeEvents();
	}

	private subscribeEvents(): void {
		this.events.on('delivery:submit', (deliveryData: DeliveryData) => {
			this.deliveryData = deliveryData;
		});

		this.events.on('contacts:submit', async (contactData: ContactData) => {
			this.events.emit('modal:close');

			const items = this.model.getItems();
			if (!this.deliveryData) {
				this.events.emit('order:error', {
					message: 'Данные доставки не найдены',
				});
				return;
			}

			try {
				await this.api.postOrderLot({
					items,
					delivery: this.deliveryData,
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

			const successComponent = new Success(this.events, total).render();
			this.events.emit('modal:open', successComponent);
		});

		this.events.on(
			'order:submit',
			(payload?: { email?: string; phone?: string }) => {
				this.events.emit('modal:close');

				const formModel = new FormModel();
				if (!payload || !formModel.validate(payload as ContactData)) {
					this.events.emit('order:open');
					return;
				}

				const total = this.model.getTotal();

				this.model.clear();

				const successModal = new Success(this.events, total).render();
				this.events.emit('modal:open', successModal);
			}
		);
	}
}
