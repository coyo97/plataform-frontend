// shared/atoms/counters/counter.types.ts
export interface CounterProps {
	value: number;
	/** color del número – sigue tu design-tokens */
	variant?: 'default' | 'primary' | 'secondary' | 'warning' | 'error';
	className?: string;
}

