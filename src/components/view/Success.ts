import { EventEmitter } from '../base/events';

export class Success {
	private root!: HTMLElement;

	constructor(private events: EventEmitter, private total: number) {}

	render(): HTMLElement {
		const template = document.querySelector<HTMLTemplateElement>('#success');
		const fragment = template?.content.cloneNode(true);

		if (!(fragment instanceof DocumentFragment)) {
			throw new Error('Шаблон #success не найден в DOM');
		}

		const root =
			(fragment.querySelector('.order-success') as HTMLElement) ??
			(fragment.firstElementChild as HTMLElement);

		if (!root) {
			throw new Error('В шаблоне #success отсутствует .order-success');
		}

		const sumNode = root.querySelector(
			'.order-success__description'
		) as HTMLElement | null;
		if (sumNode) {
			sumNode.textContent = `Списано ${this.total} синапсов`;
		}

		root
			.querySelector('.order-success__close')
			?.addEventListener('click', () => this.close());

		const contentWrapper = document.createElement('div');
		contentWrapper.classList.add('modal__content');
		contentWrapper.appendChild(root);

		return contentWrapper;
	}

	private close() {
		this.events.emit('modal:close');
		this.events.emit('order:clear');
		const activeModal = document.querySelector(
			'.modal.modal_active'
		) as HTMLElement | null;
		if (activeModal) {
			activeModal.classList.remove('modal_active');
		}
	}
}
