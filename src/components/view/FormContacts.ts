import { EventEmitter } from '../base/events';

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

			let isValid = true;

			email.classList.remove('form__input_type_error');
			phone.classList.remove('form__input_type_error');

			if (!email.value.trim()) {
				email.classList.add('form__input_type_error');
				isValid = false;
			}

			if (!phone.value.trim()) {
				phone.classList.add('form__input_type_error');
				isValid = false;
			}

			if (!isValid) return;

			this.events.emit('order:submit', {
				email: email.value,
				phone: phone.value,
			});
		});

		this.container = form;
		return form;
	}
}
