import { ContactFormData, OrderFormData } from '../../types';

export class FormModel {
	private _order: OrderFormData = { address: '', payment: 'card' };
	private _contacts: ContactFormData = { email: '', phone: '' };

	setOrder(data: OrderFormData) {
		this._order = data;
	}

	setContacts(data: ContactFormData) {
		this._contacts = data;
	}

	getOrder(): OrderFormData {
		return this._order;
	}

	getContacts(): ContactFormData {
		return this._contacts;
	}

	isOrderValid(): boolean {
		return this._order.address.trim() !== '' && !!this._order.payment;
	}

	isContactsValid(): boolean {
		const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._contacts.email);
		const phoneValid = /^\+7\d{10}$/.test(this._contacts.phone);
		return emailValid && phoneValid;
	}
}
