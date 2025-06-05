import './scss/styles.scss';

import { ApiModel } from './components/model/ApiModel';
import { DataModel } from './components/model/DataModel';

const api = new ApiModel();
const dataModel = new DataModel();

api
	.getListProductCard()
	.then((products) => {
		dataModel.setProducts(products);
		console.log('Загруженные товары:', dataModel.getProducts());
	})
	.catch((err) => {
		console.error('Ошибка загрузки товаров:', err);
	});
