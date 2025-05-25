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
	if (!existingItem) {
		cart.push({ product });
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
		)!.textContent = `${item.product.price} синапсов`;

		list.append(basketItem);
		sum += item.product.price || 0;
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
	const orderButton = modal.querySelector('.basket__button');
	orderButton?.addEventListener('click', () => {
		renderOrderForm();
	});
}

function renderOrderForm() {
	const modal = cloneTemplate<HTMLFormElement>('#order');

	const modalContainer = document.getElementById('modal-container');
	if (modalContainer) {
		const modalContent = modalContainer.querySelector('.modal__content');
		if (modalContent) {
			modalContent.innerHTML = '';
			modalContent.append(modal);
			modalContainer.classList.add('modal_active');
			initOrderForm(modal);
		}
	}
}

function initOrderForm(modal: HTMLFormElement) {
	let payment: 'card' | 'cash' | null = null;

	const cardBtn = modal.querySelector('button[name="card"]');
	const cashBtn = modal.querySelector('button[name="cash"]');
	const addressInput = modal.querySelector<HTMLInputElement>(
		'input[name="address"]'
	);
	const nextButton = modal.querySelector<HTMLButtonElement>('.order__button');

	function validate() {
		const isValid = payment && addressInput?.value.trim();
		if (nextButton) nextButton.disabled = !isValid;
	}

	cardBtn?.addEventListener('click', () => {
		payment = 'card';
		cardBtn.classList.add('button_alt-active');
		cashBtn?.classList.remove('button_alt-active');
		validate();
	});

	cashBtn?.addEventListener('click', () => {
		payment = 'cash';
		cashBtn.classList.add('button_alt-active');
		cardBtn?.classList.remove('button_alt-active');
		validate();
	});

	addressInput?.addEventListener('input', validate);

	modal.addEventListener('submit', (e) => {
		e.preventDefault();
		if (!payment || !addressInput?.value.trim()) return;

		events.emit('order:submit', {
			payment,
			address: addressInput.value.trim(),
		});

		renderContactsForm();
	});
}

function renderContactsForm() {
	const modal = cloneTemplate<HTMLFormElement>('#contacts');

	const modalContainer = document.getElementById('modal-container');
	if (modalContainer) {
		const modalContent = modalContainer.querySelector('.modal__content');
		if (modalContent) {
			modalContent.innerHTML = '';
			modalContent.append(modal);
			modalContainer.classList.add('modal_active');
			initContactsForm(modal);
		}
	}
}

function initContactsForm(modal: HTMLFormElement) {
	const emailInput = modal.querySelector<HTMLInputElement>(
		'input[name="email"]'
	);
	const phoneInput = modal.querySelector<HTMLInputElement>(
		'input[name="phone"]'
	);
	const submitButton = modal.querySelector<HTMLButtonElement>(
		'button[type="submit"]'
	);

	function validate() {
		const isValid = emailInput?.value.trim() && phoneInput?.value.trim();
		if (submitButton) submitButton.disabled = !isValid;
	}

	emailInput?.addEventListener('input', validate);
	phoneInput?.addEventListener('input', validate);

	modal.addEventListener('submit', (e) => {
		e.preventDefault();
		if (!emailInput?.value || !phoneInput?.value) return;

		events.emit('order:submit', {
			email: emailInput.value.trim(),
			phone: phoneInput.value.trim(),
		});

		renderSuccessModal();
	});
}

function renderSuccessModal() {
	const modal = cloneTemplate<HTMLDivElement>('#success');

	const modalContainer = document.getElementById('modal-container');
	if (modalContainer) {
		const modalContent = modalContainer.querySelector('.modal__content');
		if (modalContent) {
			modalContent.innerHTML = '';
			modalContent.append(modal);
			modalContainer.classList.add('modal_active');
		}
	}

	const closeBtn = modal.querySelector('.order-success__close');
	closeBtn?.addEventListener('click', () => {
		modalContainer?.classList.remove('modal_active');
	});
}
