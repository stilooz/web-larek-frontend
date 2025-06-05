import { Api } from '../base/api';
import type { Product } from '../../types';
import { API_URL } from '../../utils/constants';

export class ApiModel extends Api {
	constructor() {
		console.log('API_URL:', API_URL);
		super(API_URL);
	}

	getListProductCard(): Promise<Product[]> {
		return this.get('/product').then(
			(data: { items: Product[] }) => data.items
		);
	}

	postOrderLot(data: object): Promise<object> {
		return this.post('/order', data);
	}
}
