import { EventEmitter } from '../base/events';
import { FormModel } from '../model/FormModel';
export class FormContacts {
	private container: HTMLFormElement;

	constructor(private events: EventEmitter) {}

	render(): HTMLFormElement {
		const template = document.querySelector<HTMLTemplateElement>('#contacts');
		const clone = template?.content.cloneNode(true);
		if (!(clone instanceof DocumentFragment)) {
			throw new Error('Шаблон #contacts не найден');
		}

		const form = clone.querySelector('form');
		if (!form) {
			throw new Error('Форма не найдена в шаблоне');
		}

		const email = form.elements.namedItem('email') as HTMLInputElement;
		const phone = form.elements.namedItem('phone') as HTMLInputElement;

		const submitButton = form.querySelector<HTMLButtonElement>(
			'button[type="submit"], .order__button'
		);

		const showError = () => {
			let errorNode = form.querySelector('.form__error') as HTMLElement;

			if (!errorNode) {
				errorNode = document.createElement('span');
				errorNode.classList.add('form__error');
				submitButton?.insertAdjacentElement('afterend', errorNode);
			}

			if (!email.value.trim() || !phone.value.trim()) {
				errorNode.textContent = 'Пожалуйста, заполните все поля.';
			} else {
				errorNode.textContent = '';
			}
		};

		const toggleButtonState = () => {
			const digitsPhone = phone.value.replace(/[^\d]/g, '');
			const isFilled = email.value.trim() !== '' && digitsPhone.length === 11;

			if (submitButton) {
				submitButton.disabled = !isFilled;
			}

			showError();
		};

		form.addEventListener('submit', (event) => {
			event.preventDefault();

			email.classList.remove('form__input_type_error');
			phone.classList.remove('form__input_type_error');

			let errorNode = form.querySelector('.form__error') as HTMLElement;

			if (!errorNode) {
				const button = form.querySelector('.order__button');
				errorNode = document.createElement('span');
				errorNode.classList.add('form__error');
				button?.insertAdjacentElement('afterend', errorNode);
			}

			errorNode.textContent = '';

			const digitsPhone = phone.value.replace(/[^\d]/g, '');

			const validation = FormModel.validateContacts({
				email: email.value.trim(),
				phone: digitsPhone,
			});

			if (!validation.valid) {
				if (validation.errors.email) {
					email.classList.add('form__input_type_error');
				}

				if (validation.errors.phone) {
					phone.classList.add('form__input_type_error');
				}

				errorNode.textContent = 'Пожалуйста, заполните все поля.';
				return;
			}

			errorNode.textContent = '';

			this.events.emit('order:submit', {
				email: email.value,
				phone: digitsPhone,
			});
		});

		email.addEventListener('input', () => {
			email.value = email.value.replace(/[А-Яа-яЁё]/g, '');
		});

		let lastValidPhone = '';
		phone.addEventListener('input', () => {
			phone.value = phone.value.replace(/[^\d()+\-\s]/g, '');

			const digitsOnly = phone.value.replace(/[^\d]/g, '');
			if (digitsOnly.length > 11) {
				// revert to the last state that contained ≤ 11 digits
				phone.value = lastValidPhone;
			} else {
				lastValidPhone = phone.value;
			}
		});

		email.addEventListener('input', showError);
		phone.addEventListener('input', showError);

		email.addEventListener('input', toggleButtonState);
		phone.addEventListener('input', toggleButtonState);

		toggleButtonState();

		this.container = form;
		return form;
	}
}
