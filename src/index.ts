import './scss/styles.scss';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/base/api-larek';
import { ApiModel } from './components/model/ApiModel';
import { DataModel } from './components/model/DataModel';
import { BasketModel } from './components/model/BasketModel';
import { FormModel } from './components/model/FormModel';
import { Modal } from './components/view/Modal';
import { Card } from './components/view/Card';
import { CardPreview } from './components/view/CardPreview';
import { Basket } from './components/view/Basket';
import { FormOrder } from './components/view/FormOrder';
import { FormContacts } from './components/view/FormContacts';
import { Success } from './components/view/Succes';

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

//загрузка и отображение каталога
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

//открытие корзины
const basketButton = document.querySelector('.header__basket');
basketButton?.addEventListener('click', () => {
	modal.open(basketView['_wrapper']);
	basketView.render(basketModel.getItems());
});

//добавление товара в корзину
events.on('product:add', ({ product }) => {
	basketModel.add(product);
	basketView.render(basketModel.getItems());
});

//запуск оформления заказа
const orderButton = document.querySelector('.basket__order');
orderButton?.addEventListener('click', () => {
	modal.open(formOrder.form);
});

//переход к контактам после выбора способа доставки
formOrder.form.addEventListener('submit', (e) => {
	e.preventDefault();
	formModel.setOrder(formOrder.data);
	if (formModel.isOrderValid()) {
		modal.open(formContacts.form);
	} else {
		alert('Заполните адрес и выберите способ оплаты');
	}
});

//завершение оформления
formContacts.form.addEventListener('submit', (e) => {
	e.preventDefault();
	formModel.setContacts(formContacts.data);
	if (formModel.isContactsValid()) {
		const total = basketModel.getTotal();
		basketModel.clear();
		modal.open(success.element);
		success.total = total;
	} else {
		alert('Введите корректные email и телефон');
	}
});
