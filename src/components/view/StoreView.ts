import { Product } from '../../types';
import { Card } from './Card';
import { EventEmitter } from '../base/events';

export class StoreView {
  constructor(private root: HTMLElement, private events: EventEmitter) {}

  clearCatalog() {
    this.root.innerHTML = '';
  }

  renderCatalog(products: Product[]) {
    products.forEach((product) => {
      const card = new Card(product, this.events);
      this.root.append(card.element);
    });
  }

  updateCardPreviewButton(items: Product[], productId: string) {
    const modalContainer = document.querySelector('.modal') as HTMLElement | null;
    if (!modalContainer || !modalContainer.classList.contains('modal_active')) return;

    const cardContainer = modalContainer.querySelector('.card') as HTMLElement | null;
    const cardButton = cardContainer?.querySelector('.card__button') as HTMLButtonElement | null;
    const cardTitle = cardContainer?.querySelector('.card__title') as HTMLElement | null;

    if (!cardContainer || !cardButton || !cardTitle) return;

    const isInBasket = items.some((item) => item.id === productId);
    cardButton.textContent = 'Купить';
    cardButton.disabled = isInBasket;

    const newButton = cardButton.cloneNode(true) as HTMLButtonElement;
    if (!isInBasket) {
      newButton.addEventListener('click', () => {
        const product = items.find((item) => item.id === productId);
        if (product) {
          this.events.emit('card:buy', product);
        }
      });
    }
    cardButton.replaceWith(newButton);
  }

  set lock(isLock: boolean) {
    if (isLock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
