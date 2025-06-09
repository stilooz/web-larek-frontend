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
				const fallback = form.querySelector('.order__field') || form;
				errorNode = document.createElement('span');
				errorNode.classList.add('form__error');
				fallback.appendChild(errorNode);
			}

			errorNode.textContent = '';

			const validation = FormModel.validateContacts({
				email: email.value,
				phone: phone.value,
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

			this.events.emit('order:submit', {
				email: email.value,
				phone: phone.value,
			});
		});

		this.container = form;
		return form;
	}
}
