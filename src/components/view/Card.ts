import { Product } from '../../types';
import { EventEmitter } from '../base/events';
import { CDN_URL } from '../../utils/constants';

export class BaseCard {
	public element: HTMLElement;
	protected product: Product;
	protected events?: EventEmitter;
	protected button: HTMLButtonElement | null = null;

	constructor(product: Product, templateId: string, events?: EventEmitter) {
		this.product = product;
		this.events = events;
		const template = document.getElementById(templateId) as HTMLTemplateElement;
		if (!template) throw new Error(`Шаблон #${templateId} не найден в index.html`);
		const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

		const image = card.querySelector('.card__image') as HTMLImageElement;
		if (image) {
			image.src = `${CDN_URL}/${product.image}`;
			image.alt = product.title;
		}

		const title = card.querySelector('.card__title') as HTMLElement;
		if (title) title.textContent = product.title;

		const category = card.querySelector('.card__category') as HTMLElement;
		if (category) {
			category.textContent = product.category;
			category.className = category.className
				.split(' ')
				.filter((cls) => !cls.startsWith('card__category_'))
				.join(' ')
				.trim();
			const categoryMap: Record<Product['category'], string> = {
				'софт-скил': 'soft',
				'хард-скил': 'hard',
				другое: 'other',
				кнопка: 'button',
				дополнительное: 'additional',
				фреймворк: 'framework',
			};
			const categoryClass = categoryMap[product.category] ?? 'other';
			category.classList.add(`card__category_${categoryClass}`);
		}

		const price = card.querySelector('.card__price') as HTMLElement;
		if (price) {
			price.textContent =
				product.price !== null &&
				product.price !== undefined &&
				product.price !== 0
					? `${product.price} синапсов`
					: 'Бесценно';
		}

		this.button = card.querySelector('.card__button') as HTMLButtonElement;
		this.element = card;
	}
}

export class Card extends BaseCard {
	constructor(product: Product, events: EventEmitter) {
		super(product, 'card-catalog', events);
		this.element.addEventListener('click', () => {
			this.events?.emit('card:select', this.product);
		});
		if (this.button) {
			this.button.addEventListener('click', (evt) => {
				evt.stopPropagation();
				this.events?.emit('card:buy', this.product);
			});
		}
	}
}
