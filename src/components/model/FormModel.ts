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
		const valid = data.email.trim() !== '' && data.phone.trim() !== '';
		if (!valid) {
			this.emit('form:error', { message: 'Введите Email и номер телефона' });
		}
		return valid;
	}
}
