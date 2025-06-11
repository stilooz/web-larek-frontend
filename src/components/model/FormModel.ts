import { EventEmitter } from '../base/events';
import type { ContactData } from '../../types';

export class FormModel extends EventEmitter {
	constructor(events?: EventEmitter) {
		super();
		if (events) {
			this.subscribe(events);
		}
	}

	private subscribe(events: EventEmitter) {
		events.on('form:error', (data: { message: string }) => {
			this.emit('form:error', data);
		});
	}

	validate(data: ContactData) {
		const errors: string[] = [];

		const emailValid = data.email.trim() !== '';
		const phoneDigits = data.phone.replace(/[^\d]/g, '');
		const phoneValid = phoneDigits.length === 11;

		if (!emailValid) {
			errors.push('Email не заполнен');
		}

		if (!phoneValid) {
			errors.push('Номер телефона должен содержать 11 цифр');
		}

		const valid = errors.length === 0;

		if (!valid) {
			this.emit('form:error', { message: errors.join('. ') });
		}

		return valid;
	}
}
