import { EventEmitter } from '../base/events';
import type { OrderInfo, ContactData } from '../../types';

export class FormModel extends EventEmitter {
	static validateContacts(data: ContactData) {
		const errors: { email?: string; phone?: string } = {};
		let valid = true;

		if (!data.email.trim()) {
			errors.email = 'Введите Email';
			valid = false;
		}

		if (!data.phone.trim()) {
			errors.phone = 'Введите номер телефона';
			valid = false;
		}

		return { valid, errors };
	}

	async submitOrder(orderData: OrderInfo) {
		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orderData),
			});
			if (!response.ok) {
				throw new Error('Не удалось');
			}
			this.emit('order:submit', orderData);
			return await response.json();
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
