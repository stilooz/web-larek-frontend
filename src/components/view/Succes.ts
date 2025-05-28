import { ensureElement } from '../../utils/utils';

export class Success {
	private _element: HTMLElement;
	private _description: HTMLElement;

	constructor(selector = '#success') {
		this._element = ensureElement(selector);
		this._description = this._element.querySelector(
			'.order-success__description'
		)!;
	}

	set total(value: number) {
		this._description.textContent = `Списано ${value}₽`;
	}

	get element(): HTMLElement {
		return this._element;
	}
}
