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
			const addressWrapper = formElement.querySelector<HTMLElement>(
				'.order__field:last-of-type'
			);
			const nextButton = formElement.querySelector<HTMLButtonElement>(
				'button[type="submit"]'
			);

			let paymentSelected = '';

			const updateState = () => {
				const address = addressInput?.value.trim();
				if (paymentSelected && address) {
					nextButton?.removeAttribute('disabled');
				} else {
					nextButton?.setAttribute('disabled', 'true');
				}
			};

			cardBtn?.addEventListener('click', () => {
				cardBtn.classList.add('button_alt-active');
				cashBtn?.classList.remove('button_alt-active');
				paymentSelected = 'card';
				updateState();
			});

			cashBtn?.addEventListener('click', () => {
				cashBtn.classList.add('button_alt-active');
				cardBtn?.classList.remove('button_alt-active');
				paymentSelected = 'cash';
				updateState();
			});

			addressInput?.addEventListener('input', updateState);

			this.events.emit('modal:open', formElement);

			formElement.addEventListener('submit', (e) => {
				e.preventDefault();

				const address = addressInput?.value.trim();
				if (!paymentSelected || !address) {
					alert('Пожалуйста, заполните адрес и выберите способ оплаты.');
					return;
				}

				const modalContent = document.querySelector('.modal__content');
				if (!modalContent) return;

				const contactsForm = new FormContacts(this.events);
				modalContent.innerHTML = '';
				modalContent.append(contactsForm.render());
			});
		});
	}
}
