import './scss/styles.scss';
import { Card } from './components/view/Card';
import { EventEmitter } from './components/base/events';
import { CardPreview } from './components/view/CardPreview';
import { ApiModel } from './components/model/ApiModel';
import { DataModel } from './components/model/DataModel';
import type { Product } from './types';
import { Modal } from './components/view/Modal';

const modal = new Modal('#modal-container');
const api = new ApiModel();
const dataModel = new DataModel();

const events = new EventEmitter();
const galleryContainer = document.querySelector('.gallery') as HTMLElement;

api
	.getListProductCard()
	.then((products) => {
		console.log('Товары с API:', products);
		dataModel.setProducts(products);
		events.emit('products:loaded', products);
	})
	.catch((err) => {
		console.error('Ошибка загрузки товаров:', err);
	});

events.on('products:loaded', (products: Product[]) => {
	if (!galleryContainer) return;
	galleryContainer.innerHTML = '';
	products.forEach((product) => {
		const card = new Card(product, events);
		galleryContainer.appendChild(card.element);
	});
});

events.on('card:select', ({ product }: { product: Product }) => {
	const preview = new CardPreview(product);
	modal.open(preview.element);
});
