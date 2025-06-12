import { EventEmitter } from '../base/events';
import { FormContacts } from './FormContacts';
import type { DeliveryData } from '../../types';

export class FormOrder {
	constructor(private events: EventEmitter, private container: HTMLElement) {
		this.events.on('order:open', () => {
			const template = document.querySelector<HTMLTemplateElement>('#order');
			const clone = template?.content.cloneNode(true);
			if (!(clone instanceof DocumentFragment)) return;

			const formElement = clone.querySelector('form');
			if (!formElement) return;

			const cardBtn = formElement.querySelector('button[name="card"]');
			const cashBtn = formElement.querySelector('button[name="cash"]');
			const addressInput = formElement.querySelector<HTMLInputElement>(
				'input[name="address"]'
			);
			const nextButton = formElement.querySelector<HTMLButtonElement>(
				'button[type="submit"]'
			);
			const errorContainer = formElement.querySelector('.form__errors');

			let selectedPayment: 'card' | 'cash' | null = null;

			const validateAndShowErrors = () => {
				const errors: string[] = [];
				
				if (!selectedPayment) {
					errors.push('Выберите способ оплаты');
				}
				
				if (!addressInput?.value.trim()) {
					errors.push('Введите адрес доставки');
				}

				if (errors.length > 0) {
					if (errorContainer) {
						errorContainer.textContent = errors.join('. ');
					}
					if (nextButton) {
						nextButton.disabled = true;
					}
				} else {
					if (errorContainer) {
						errorContainer.textContent = '';
					}
					if (nextButton) {
						nextButton.disabled = false;
					}
				}
			};

			cardBtn?.addEventListener('click', () => {
				selectedPayment = 'card';
				cardBtn.classList.add('button_alt-active');
				cashBtn?.classList.remove('button_alt-active');
				validateAndShowErrors();
			});

			cashBtn?.addEventListener('click', () => {
				selectedPayment = 'cash';
				cashBtn.classList.add('button_alt-active');
				cardBtn?.classList.remove('button_alt-active');
				validateAndShowErrors();
			});

			addressInput?.addEventListener('input', () => {
				validateAndShowErrors();
			});

			this.events.emit('modal:open', formElement);

			formElement.addEventListener('submit', (e) => {
				e.preventDefault();

				const errors: string[] = [];
				
				if (!selectedPayment) {
					errors.push('Выберите способ оплаты');
				}
				
				if (!addressInput?.value.trim()) {
					errors.push('Введите адрес доставки');
				}

				if (errors.length > 0) {
					if (errorContainer) {
						errorContainer.textContent = errors.join('. ');
					}
					return;
				}

				if (errorContainer) {
					errorContainer.textContent = '';
				}

				const deliveryData: DeliveryData = {
					payment: selectedPayment,
					address: addressInput.value.trim(),
				};
				this.events.emit('delivery:submit', deliveryData);

				const modalContent = document.querySelector('.modal__content');
				if (!modalContent) return;

				modalContent.innerHTML = '';
				const contactsForm = new FormContacts(this.events, this.container);
				modalContent.append(contactsForm.render());
			});

			validateAndShowErrors();
		});
	}
}
