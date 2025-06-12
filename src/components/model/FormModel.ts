import type { ContactData } from '../../types';

export function validateContactData(data: ContactData): boolean {
	const errors: string[] = [];

	const emailValid = data.email.trim() !== '';
	const phoneDigits = data.phone.replace(/[^\d]/g, '');
	const phoneValid = phoneDigits.length === 11;

	if (!emailValid) {
		errors.push('Email не заполнен');
	}

	if (!phoneValid) {
		errors.push('Номер телефона должен содержать 11 цифр');
	}

	return errors.length === 0;
}
