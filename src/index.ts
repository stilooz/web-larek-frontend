import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/model/ApiModel';
import { Modal } from './components/view/Modal';
import { CatalogPresenter } from './components/presenters/CatalogPresenter';
import { Basket } from './components/view/Basket';
import { BasketPresenter } from './components/presenters/BasketPresenter';
import { OrderPresenter } from './components/presenters/OrderPresenter';
import { BasketModel } from './components/model/BasketModel';
import { Product } from './types';
import { CDN_URL } from './utils/constants';
import { CardPreview } from './components/view/CardPreview';
import { StoreView } from './components/view/StoreView';

const events = new EventEmitter();
const modal = new Modal('#modal-container', events);
const api = new ApiModel();

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const storeView = new StoreView(galleryContainer, events);

const catalog = new CatalogPresenter(api, galleryContainer, events);

const basketModel = new BasketModel(events);
let currentCardPreview: CardPreview | null = null;

events.on('card:select', (product: Product) => {
	currentCardPreview = new CardPreview(product);
	(window as any).currentCardPreview = currentCardPreview;
	currentCardPreview.updateButton(basketModel.items);
	events.emit('modal:open', currentCardPreview.element);
});

events.on('basket:changed', () => {
	if (modal.isOpen && currentCardPreview) {
		currentCardPreview.updateButton(basketModel.items);
	}
});

document.addEventListener('basket:add', (event: Event) => {
	const custom = event as CustomEvent;
	events.emit('basket:add', {
		id: custom.detail.id,
		catalog: catalog.items,
	});
});

catalog.init();

const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

const basketView = new Basket(events, basketTemplate, cardBasketTemplate, basketCounter);

const basketPresenter = new BasketPresenter(basketModel, basketView, events);

new OrderPresenter(
	events,
	basketModel,
	document.querySelector('#modal-container') as HTMLElement
);

document.querySelector('.header__basket')?.addEventListener('click', () => {
	events.emit('basket:open');
});

events.on('modal:open', () => {
	storeView.lock = true;
});

events.on('modal:close', () => {
	storeView.lock = false;
});
