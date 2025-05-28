import { OrderFormData } from '../../types';
import { ensureElement } from '../../utils/utils';

export class FormOrder {
	private _form: HTMLFormElement;
	private _addressInput: HTMLInputElement;
	private _paymentButtons: NodeListOf<HTMLButtonElement>;

	constructor(selector: string = '#order-form') {
		this._form = ensureElement<HTMLFormElement>(selector);
		this._addressInput = this._form.elements.namedItem(
			'address'
		) as HTMLInputElement;
		this._paymentButtons = this._form.querySelectorAll('.button_alt')!;
	}

	get data(): OrderFormData {
		const selected = Array.from(this._paymentButtons).find((btn) =>
			btn.classList.contains('button_alt-active')
		);
		return {
			address: this._addressInput.value.trim(),
			payment: selected?.dataset.type as 'card' | 'cash',
		};
	}

	set data(data: OrderFormData) {
		this._addressInput.value = data.address;
		this._paymentButtons.forEach((btn) => {
			btn.classList.toggle(
				'button_alt-active',
				btn.dataset.type === data.payment
			);
		});
	}

	get form(): HTMLFormElement {
		return this._form;
	}
}
