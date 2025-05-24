import './scss/styles.scss';
import { LarekApi } from './components/base/api-larek';
import { API_URL } from './utils/constants';
import { Product } from './types';
import { cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
/*
создать интерфейсы?

как создать интерфейсы?

какие интерфейсы создать?

нужен апи интерфейс для получения данных с сервера, что-то уже есть в .env. разобраться с этим, для чего он нужен и как им пользоваться. получение списка товаров

создать интерфейс для товаров в котором будет отображаться: товар, модальное окно с кнопками купить и закрыть, внутри еще модалка с кнопкой "в корзину", "закрыть", кнопка + и кнопка - для увеличения и уменьшения колва товаров

сделать интерфейс с модалкой корзины: закрыть, удалить, единица товара, список товара, оформить, сумма покупки. внутри еще модалка в "оформить": закрыть, нлайн или при получении оплата, адрес доставки, далее. внутри еще модалка с потчой и телефоном, кнопка оплатить. модалка с подтверждением успешной операции и кнопка с возвращением к списку товаров.
*/

const api = new LarekApi(API_URL);
api.getProductList().then((data) => {
	renderCatalog(data.items);
});

const events = new EventEmitter();

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
