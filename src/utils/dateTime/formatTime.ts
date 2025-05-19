// src/utils/dateTime/formatTime.ts
import { formatDistanceToNow, format } from 'date-fns';

export const formatDate = (input: string | number | Date, type: 'relative' | 'absolute' | 'calendar') => {
	const date = new Date(input);

	switch (type) {
		case 'relative':
			return formatDistanceToNow(date, { addSuffix: true });
		case 'absolute':
			return format(date, 'PPpp');
		case 'calendar':
			return format(date, 'PP');
		default:
			return date.toLocaleString();
	}
};

