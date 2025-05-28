import './scss/styles.scss';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/base/api-larek';
import { ApiModel } from './components/Model/ApiModel';
import { DataModel } from './components/Model/DataModel';
import { BasketModel } from './components/Model/BasketModel';
import { FormModel } from './components/Model/FormModel';
import { Modal } from './components/View/Modal';
import { Card } from './components/View/Card';
import { CardPreview } from './components/View/CardPreview';
import { Basket } from './components/View/Basket';
import { FormOrder } from './components/View/FormOrder';
import { FormContacts } from './components/View/FormContacts';
import { Success } from './components/View/Success';

// Инициализация
const events = new EventEmitter();
const api = new LarekApi(API_URL);
const apiModel = new ApiModel(api);
const dataModel = new DataModel();
const basketModel = new BasketModel();
const formModel = new FormModel();

const modal = new Modal();
const basketView = new Basket();
const formOrder = new FormOrder();
const formContacts = new FormContacts();
const success = new Success();

// Загрузка и отображение каталога
apiModel.getProducts().then((products) => {
	dataModel.setItems(products);
	const catalog = document.querySelector('.catalog');

	products.forEach((product) => {
		const card = new Card(product);
		card.element.addEventListener('click', () => {
			const preview = new CardPreview(product);
			modal.open(preview.element);
		});
		catalog?.append(card.element);
	});
});
