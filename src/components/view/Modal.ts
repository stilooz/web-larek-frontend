import { ensureElement } from '../../utils/utils';

export class Modal {
	private _container: HTMLElement;
	private _content: HTMLElement;

	constructor(containerSelector: string = '#modal-container') {
		this._container = ensureElement(containerSelector);
		this._content = this._container.querySelector('.modal__content')!;
		this._initEvents();
	}

	private _initEvents() {
		this._container.addEventListener('click', (e: MouseEvent) => {
			if (
				e.target instanceof HTMLElement &&
				(e.target.classList.contains('modal') ||
					e.target.classList.contains('modal__close'))
			) {
				this.close();
			}
		});
	}

	open(content: HTMLElement) {
		this._content.innerHTML = '';
		this._content.append(content);
		this._container.classList.add('modal_active');
	}

	close() {
		this._container.classList.remove('modal_active');
	}
}
