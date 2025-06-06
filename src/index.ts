import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/model/ApiModel';
import { Modal } from './components/view/Modal';
import { CatalogPresenter } from './components/base/CatalogPresenter';
import { Basket } from './components/view/Basket';
import { BasketPresenter } from './components/base/BasketPresenter';
import { BasketModel } from './components/model/BasketModel';
import { Product } from './types';
import { CDN_URL } from './utils/constants';
import { CardPreview } from './components/view/CardPreview';

const events = new EventEmitter();
const modal = new Modal('#modal-container', events);
const api = new ApiModel();

const galleryContainer = document.querySelector('.gallery') as HTMLElement;

const catalog = new CatalogPresenter(api, galleryContainer, events);

const basketModel = new BasketModel(events);
let currentCardPreview: CardPreview | null = null;

events.on('card:select', (product: Product) => {
	currentCardPreview = new CardPreview(product);
	currentCardPreview.updateButton(basketModel.items);
	modal.open(currentCardPreview.element);
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

const basketView = new Basket(events);
document.body.append(basketView.render(basketModel.items));

const basketPresenter = new BasketPresenter(basketModel, basketView, events);

document.querySelector('.header__basket')?.addEventListener('click', () => {
	console.log('basket icon clicked');
	events.emit('basket:open');
});
