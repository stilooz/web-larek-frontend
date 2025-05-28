import { LarekApi } from '../base/api-larek';
import { Product } from '../../types';

export class ApiModel {
	private api: LarekApi;

	constructor(api: LarekApi) {
		this.api = api;
	}

	getProducts(): Promise<Product[]> {
		return this.api.getProductList().then((data) => data.items);
	}
}
