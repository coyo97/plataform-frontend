export interface TextItemProps {
	username: string;
	text: string;
	checked: boolean;
	onCheckChange: (val: boolean) => void;
	variant?: 'default' | 'warning' | 'error' | 'info';
	disabled?: boolean;
}

