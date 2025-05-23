import { Api, ApiListResponse } from './base/api';
import { Product } from '../types';

export class LarekApi extends Api {
	getProductList(): Promise<ApiListResponse<Product>> {
		return this.get('/product') as Promise<ApiListResponse<Product>>;
	}
}
