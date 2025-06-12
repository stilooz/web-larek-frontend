import type { ContactData } from '../../types';

export function validateContactData(data: ContactData): string[] {
	const errors: string[] = [];

	const emailValid = data.email.trim() !== '';
	const phoneValid = data.phone.trim() !== '';

	if (!emailValid) {
		errors.push('Email не заполнен');
	}

	if (!phoneValid) {
		errors.push('Введите номер телефона');
	}

	return errors;
}
