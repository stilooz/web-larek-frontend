export class Modal {
	private container: HTMLElement;
	private content: HTMLElement;
	private closeButton: HTMLElement;

	constructor(containerSelector: string) {
		this.container = document.querySelector(containerSelector) as HTMLElement;
		this.content = this.container.querySelector(
			'.modal__content'
		) as HTMLElement;
		this.closeButton = this.container.querySelector(
			'.modal__close'
		) as HTMLElement;
		console.log('container', this.container);
		console.log('closeButton', this.closeButton);
		this.closeButton.addEventListener('click', () => {
			console.log('click on close');
			this.close();
		});
		this.container.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (target === this.container) {
				this.close();
			}
		});
	}

	open(content: HTMLElement) {
		this.container.style.top = `${window.scrollY}px`;
		document.body.style.overflow = 'hidden';
		this.content.innerHTML = '';
		this.content.appendChild(content);
		this.container.classList.add('modal_active');
	}

	close() {
		document.body.style.overflow = '';
		this.container.style.top = '';
		this.container.classList.remove('modal_active');
	}
}
