import { EventEmitter } from '../base/events';

export class FormModel extends EventEmitter {
	async submitOrder(orderData: Record<string, unknown>) {
		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orderData),
			});
			if (!response.ok) {
				throw new Error('Order submission failed');
			}
			this.emit('order:submit', orderData);
			return await response.json();
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
