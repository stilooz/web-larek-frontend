export type Product = {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number;
};

export type PaymentMethod = 'card' | 'cash';

export type DeliveryData = {
	address: string;
	payment: PaymentMethod;
};

export type ContactData = {
	email: string;
	phone: string;
};

export type OrderInfo = {
	delivery: DeliveryData;
	contacts: ContactData;
	items: Product[];
};
