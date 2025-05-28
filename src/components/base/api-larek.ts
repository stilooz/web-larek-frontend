import { API_URL } from '../../utils/constants';
import { Product } from '../../types';

export class LarekApi {
	constructor(private baseUrl: string = API_URL) {}

	getProductList(): Promise<{ items: Product[] }> {
		return fetch(`${this.baseUrl}/product`).then((res) => {
			if (!res.ok) throw new Error('Ошибка при загрузке товаров');
			return res.json();
		});
	}
}
