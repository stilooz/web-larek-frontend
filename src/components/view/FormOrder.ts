import { EventEmitter } from '../base/events';

export class FormOrder {
	constructor(private events: EventEmitter, private container: HTMLElement) {
		this.events.on('order:submit', () => {
			this.container.classList.add('modal_active');
		});

		this.events.on('order:open', () => {
			const template = document.querySelector<HTMLTemplateElement>('#order');
			const clone = template?.content.cloneNode(true);
			if (!(clone instanceof DocumentFragment)) return;

			const modal = document.querySelector('#modal-container');
			const content = modal?.querySelector('.modal__content');
			if (!modal || !content) return;

			content.replaceChildren(clone);
			modal.classList.add('modal_active');

			const cardBtn = content.querySelector('button[name="card"]');
			const cashBtn = content.querySelector('button[name="cash"]');
			const addressInput = content.querySelector<HTMLInputElement>(
				'input[name="address"]'
			);
			const nextButton = content.querySelector<HTMLButtonElement>(
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
		});
	}
}
//в
