import { EventEmitter } from '../base/events';
import type { ContactData } from '../../types';
import { validateContactData } from '../model/FormModel';

export class FormContacts {
	private container: HTMLFormElement;
	private modalContainer: HTMLElement;

	constructor(private events: EventEmitter, modalContainer: HTMLElement) {
		this.modalContainer = modalContainer;
		this.events.on('contacts:open', () => {
			const formElement = this.render();
			this.events.emit('modal:open', formElement);
		});
	}

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
		const errorContainer = form.querySelector('.form__errors') as HTMLElement;

		const submitButton = form.querySelector<HTMLButtonElement>(
			'button[type="submit"], .order__button'
		);

		const validateAndShowErrors = () => {
			const digitsPhone = phone.value.replace(/[^\d]/g, '');
			const errors = validateContactData({
				email: email.value.trim(),
				phone: digitsPhone,
			});

			if (errors.length > 0) {
				email.classList.add('form__input_type_error');
				phone.classList.add('form__input_type_error');
				errorContainer.textContent = errors.join('. ');
			} else {
				email.classList.remove('form__input_type_error');
				phone.classList.remove('form__input_type_error');
				errorContainer.textContent = '';
			}

			if (submitButton) {
				submitButton.disabled = errors.length > 0;
			}
		};

		form.addEventListener('submit', (event) => {
			event.preventDefault();

			const digitsPhone = phone.value.replace(/[^\d]/g, '');
			const errors = validateContactData({
				email: email.value.trim(),
				phone: digitsPhone,
			});

			if (errors.length > 0) {
				email.classList.add('form__input_type_error');
				phone.classList.add('form__input_type_error');
				errorContainer.textContent = errors.join('. ');
				return;
			}

			this.events.emit('order:submit', {
				email: email.value,
				phone: digitsPhone,
			} as ContactData);
		});

		email.addEventListener('input', () => {
			email.value = email.value.replace(/[А-Яа-яЁё]/g, '');
			validateAndShowErrors();
		});

		phone.addEventListener('input', () => {
			phone.value = phone.value.replace(/[^\d()+\-\s]/g, '');
			validateAndShowErrors();
		});

		validateAndShowErrors();

		return form;
	}
}
