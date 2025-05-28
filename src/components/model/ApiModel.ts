import { LarekApi } from '../base/api-larek';
import { IProductItem } from '../../types';

export class ApiModel {
	private api: LarekApi;

	constructor(api: LarekApi) {
		this.api = api;
	}

	getProducts(): Promise<IProductItem[]> {
		return this.api.getProductList().then((data) => data.items);
	}
}
