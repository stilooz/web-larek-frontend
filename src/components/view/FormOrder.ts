import { EventEmitter } from '../base/events';
import { FormContacts } from './FormContacts';

export class FormOrder {
	constructor(private events: EventEmitter, private container: HTMLElement) {
		this.events.on('order:submit', () => {
			this.container.classList.add('modal_active');
		});

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

			let selectedPayment: 'card' | 'cash' | null = null;

			const errorContainer = formElement.querySelector('.form__errors');

			const updateButtonState = () => {
				const isAddressFilled = !!addressInput?.value.trim();
				const isPaymentSelected = !!selectedPayment;
				if (nextButton) {
					nextButton.disabled = !(isAddressFilled && isPaymentSelected);
				}
			};

			const showError = () => {
				if (!selectedPayment || !addressInput?.value.trim()) {
					errorContainer.textContent =
						'Выберите способ оплаты и введите адрес доставки.';
				} else {
					errorContainer.textContent = '';
				}
			};

			cardBtn?.addEventListener('click', () => {
				selectedPayment = 'card';
				cardBtn.classList.add('button_alt-active');
				cashBtn?.classList.remove('button_alt-active');
				updateButtonState();
				showError();
			});

			cashBtn?.addEventListener('click', () => {
				selectedPayment = 'cash';
				cashBtn.classList.add('button_alt-active');
				cardBtn?.classList.remove('button_alt-active');
				updateButtonState();
				showError();
			});

			addressInput?.addEventListener('input', () => {
				updateButtonState();
				showError();
			});

			this.events.emit('modal:open', formElement);

			formElement.addEventListener('submit', (e) => {
				e.preventDefault();

				if (!selectedPayment || !addressInput?.value.trim()) {
					if (errorContainer) {
						errorContainer.textContent =
							'Выберите способ оплаты и введите адрес доставки.';
					}
					return;
				}
				if (errorContainer) {
					errorContainer.textContent = '';
				}

				const modalContent = document.querySelector('.modal__content');
				if (!modalContent) return;

				modalContent.innerHTML = '';
				const contactsForm = new FormContacts(this.events);
				modalContent.append(contactsForm.render());
			});
		});
	}
}
