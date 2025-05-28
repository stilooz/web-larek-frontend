export interface Product {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
}

export interface CartItem {
	product: Product;
}

export interface OrderFormData {
	payment: 'card' | 'cash';
	address: string;
}

export interface ContactFormData {
	email: string;
	phone: string;
}
