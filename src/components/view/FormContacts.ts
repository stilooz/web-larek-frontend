import { EventEmitter } from '../base/events';

export class FormContacts {
	constructor(private events: EventEmitter) {}

	public submit() {
		this.events.emit('order:submit');
	}
}
