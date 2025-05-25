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

export interface AppEventMap {
	'catalog: productSelected': { product: Product };
	'cart: add': { product: Product };
	'cart: remove': { productId: string };
	'cart: update': { items: CartItem[] };
	'order: submit': { order: OrderFormData & ContactFormData };
	'order: success': { orderId: string };
}
