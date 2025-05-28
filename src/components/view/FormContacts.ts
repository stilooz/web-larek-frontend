import { ContactFormData } from '../../types';
import { ensureElement } from '../../utils/utils';

export class FormContacts {
	private _form: HTMLFormElement;
	private _emailInput: HTMLInputElement;
	private _phoneInput: HTMLInputElement;

	constructor(selector = '#contacts-form') {
		this._form = ensureElement<HTMLFormElement>(selector);
		this._emailInput = this._form.elements.namedItem(
			'email'
		) as HTMLInputElement;
		this._phoneInput = this._form.elements.namedItem(
			'phone'
		) as HTMLInputElement;
	}

	get data(): ContactFormData {
		return {
			email: this._emailInput.value.trim(),
			phone: this._phoneInput.value.trim(),
		};
	}

	set data(data: ContactFormData) {
		this._emailInput.value = data.email;
		this._phoneInput.value = data.phone;
	}

	get form(): HTMLFormElement {
		return this._form;
	}
}
