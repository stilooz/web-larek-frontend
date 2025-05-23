import './scss/styles.scss';
import { LarekApi } from './components/base/api-larek';
import { API_URL } from './utils/constants';
import { Product } from './types';
import { cloneTemplate } from './utils/utils';
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

function renderProductCard(product: Product): HTMLElement {
	const card = cloneTemplate<HTMLButtonElement>('#card-catalog');

	card.querySelector('.card__title')!.textContent = product.title;
	card.querySelector('.card__price')!.textContent = `${product.price} синапсов`;
	carf.querySelector('.card__category')!.textContent = product.category;
	(card.querySelector('.card__image') as HTMLImageElement).src = product.image;

	return card;
}

function renderCatalog(products: Product[]) {
	const container = document.querySelector('.gallery')!;
	container.innerHTML = '';
	products.forEach((product) => {
		const card = renderProductCard(product);
		container.append(card);
	});
}
