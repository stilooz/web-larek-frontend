import { EventEmitter } from '../base/events';
export class Modal {
	private container: HTMLElement;
	private content: HTMLElement;
	private closeButton: HTMLElement;

	constructor(containerSelector: string, events: EventEmitter) {
		this.container = document.querySelector(containerSelector) as HTMLElement;
		this.content = this.container.querySelector(
			'.modal__content'
		) as HTMLElement;
		events.on('modal:open', (content: HTMLElement) => {
			this.open(content);
		});
		events.on('modal:close', this.close.bind(this));
		this.closeButton = this.container.querySelector(
			'.modal__close'
		) as HTMLElement;
		this.closeButton.addEventListener('click', () => {
			events.emit('modal:close');
		});
		this.container.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (target === this.container) {
				events.emit('modal:close');
			}
		});
	}

	public get isOpen(): boolean {
		return this.container.classList.contains('modal_active');
	}

	public get getContent(): HTMLElement {
		return this.content;
	}

	open(content: HTMLElement) {
		this.container.style.top = `${window.scrollY}px`;
		this.content.innerHTML = '';
		this.content.appendChild(content);
		this.container.classList.add('modal_active'); 
	}

	close() {
		this.container.style.top = '';
		this.content.innerHTML = '';
		this.container.classList.remove('modal_active');
	}
}
