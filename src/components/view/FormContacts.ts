import { EventEmitter } from '../base/events';

export class FormContacts {
	private container: HTMLFormElement;

	constructor(private events: EventEmitter) {}

	render(): HTMLFormElement {
		const form = document.createElement('form');
		form.classList.add('form', 'form_type_contacts');

		form.innerHTML = `
      <label class="form__label">
        <span class="form__text">Email</span>
        <input type="email" name="email" class="form__input" placeholder="Введите email" required />
      </label>
      <label class="form__label">
        <span class="form__text">Телефон</span>
        <input type="tel" name="phone" class="form__input" placeholder="+7" required />
      </label>
      <button type="submit" class="button">Оплатить</button>
    `;

		form.addEventListener('submit', (event) => {
			event.preventDefault();
			const email = form.elements.namedItem('email') as HTMLInputElement;
			const phone = form.elements.namedItem('phone') as HTMLInputElement;

			if (!email.value || !phone.value) {
				alert('Пожалуйста, заполните все поля.');
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
