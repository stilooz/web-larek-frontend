import './scss/styles.scss';
import { LarekApi } from './components/base/api-larek';
import { API_URL } from './utils/constants';
import { Product } from './types';
import { cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { CartItem } from './types';

const api = new LarekApi(API_URL);
api.getProductList().then((data) => {
	renderCatalog(data.items);
});

const events = new EventEmitter();

const cart: CartItem[] = [];

function renderProductCard(product: Product): HTMLElement {
	const card = cloneTemplate<HTMLButtonElement>('#card-catalog');

	const titleElement = card.querySelector('.card__title');
	if (titleElement) titleElement.textContent = product.title;

	const priceElement = card.querySelector('.card__price');
	if (priceElement) priceElement.textContent = `${product.price} синапсов`;

	const categoryElement = card.querySelector('.card__category');
	if (categoryElement) categoryElement.textContent = product.category;

	const imageElement = card.querySelector(
		'.card__image'
	) as HTMLImageElement | null;
	if (imageElement) imageElement.src = product.image;

	card.addEventListener('click', () => {
		events.emit('catalog: productSelected', { product });
	});

	return card;
}

function renderCatalog(products: Product[]) {
	const container = document.querySelector('.gallery');
	if (!container) {
		throw new Error('Элемент .gallery не найден');
	}
	container.innerHTML = '';
	products.forEach((product) => {
		const card = renderProductCard(product);
		container.append(card);
	});
}

events.on<{ product: Product }>('catalog: productSelected', ({ product }) => {
	const modal = cloneTemplate<HTMLDivElement>('#card-preview');

	const imageElement = modal.querySelector('.card__image') as HTMLImageElement;
	if (imageElement) imageElement.src = product.image;

	const categoryElement = modal.querySelector('.card__category');
	if (categoryElement) categoryElement.textContent = product.category;

	const titleElement = modal.querySelector('.card__title');
	if (titleElement) titleElement.textContent = product.title;

	const descriptionElement = modal.querySelector('.card__text');
	if (descriptionElement) descriptionElement.textContent = product.description;

	const priceElement = modal.querySelector('.card__price');
	if (priceElement) priceElement.textContent = `${product.price} синапсов`;

	const modalContainer = document.getElementById('modal-container');
	if (modalContainer) {
		const modalContent = modalContainer.querySelector('.modal__content');
		if (modalContent) {
			modalContent.innerHTML = '';
			modalContent.append(modal);
			modalContainer.classList.add('modal_active');
		}
		const closeButton = modalContainer.querySelector('.modal__close');
		closeButton?.addEventListener('click', () => {
			modalContainer.classList.remove('modal_active');
		});
		const addToCartButton = modal.querySelector('.card__button');
		addToCartButton?.addEventListener('click', () => {
			events.emit<{ product: Product }>('cart: add', { product });
		});
	}
});

events.on<{ product: Product }>('cart: add', ({ product }) => {
	const existingItem = cart.find((item) => item.product.id === product.id);
	if (existingItem) {
		existingItem.quantity += 1;
	} else {
		cart.push({ product, quantity: 1 });
	}

	renderCartModal();
});

function renderCartModal() {
	const modal = cloneTemplate<HTMLDivElement>('#basket');
	const list = modal.querySelector('.basket__list')!;
	const total = modal.querySelector('.basket__price')!;

	list.innerHTML = '';
	let sum = 0;

	cart.forEach((item, index) => {
		const basketItem = cloneTemplate<HTMLLIElement>('#card-basket');
		basketItem.querySelector('.basket__item-index')!.textContent = String(
			index + 1
		);
		basketItem.querySelector('.card__title')!.textContent = item.product.title;
		basketItem.querySelector(
			'.card__price'
		)!.textContent = `${item.product.price} * ${item.quantity} синапсов`;

		list.append(basketItem);
		sum += item.product.price * item.quantity;
	});
	total.textContent = `${sum} синапсов`;

	const modalContainer = document.getElementById('modal-container');
	if (modalContainer) {
		const modalContent = modalContainer.querySelector('.modal__content');
		if (modalContent) {
			modalContent.innerHTML = '';
			modalContent.append(modal);
			modalContainer.classList.add('modal_active');
		}
	}
}
