import { EventEmitter } from '../base/events';
import { FormModel } from '../model/FormModel';

export class FormContacts {
	private container: HTMLFormElement;

	constructor(private events: EventEmitter) {}

	render(): HTMLFormElement {
		const template = document.querySelector<HTMLTemplateElement>('#contacts');
		const clone = template?.content.cloneNode(true);
		if (!(clone instanceof DocumentFragment))
			throw new Error('Шаблон #contacts не найден');

		const form = clone.querySelector('form');
		if (!form) throw new Error('Форма не найдена в шаблоне');

		form.addEventListener('submit', (event) => {
			event.preventDefault();

			const email = form.elements.namedItem('email') as HTMLInputElement;
			const phone = form.elements.namedItem('phone') as HTMLInputElement;

			email.classList.remove('form__input_type_error');
			phone.classList.remove('form__input_type_error');

			let errorNode = form.querySelector('.form__error') as HTMLElement;

			if (!errorNode) {
				const button = form.querySelector('.order__button');
				errorNode = document.createElement('span');
				errorNode.classList.add('form__error');
				button?.insertAdjacentElement('beforebegin', errorNode);
			}

			errorNode.textContent = '';

			const validation = FormModel.validateContacts({
				email: email.value,
				phone: phone.value,
			});

			const showError = () => {
				if (!email.value.trim() || !phone.value.trim()) {
					errorNode.textContent = 'Пожалуйста, заполните все поля.';
				} else {
					errorNode.textContent = '';
				}
			};

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

			this.events.emit('order:submit', {
				email: email.value,
				phone: phone.value,
			});
		});

		const email = form.elements.namedItem('email') as HTMLInputElement;
		const phone = form.elements.namedItem('phone') as HTMLInputElement;

		const showError = () => {
			if (!email.value.trim() || !phone.value.trim()) {
				const errorNode = form.querySelector('.form__errors') as HTMLElement;
				errorNode.textContent = 'Пожалуйста, заполните все поля.';
			} else {
				const errorNode = form.querySelector('.form__error') as HTMLElement;
				if (errorNode) {
					errorNode.textContent = '';
				}
			}
		};

		email.addEventListener('input', () => {
			email.value = email.value.replace(/[А-Яа-яЁё]/g, '');
		});
		email.addEventListener('input', showError);
		phone.addEventListener('input', showError);
		phone.addEventListener('input', () => {
			phone.value = phone.value.replace(/[^\d()+\-\s]/g, '');
		});

		this.container = form;
		return form;
	}
}
