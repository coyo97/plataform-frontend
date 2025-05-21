// shared/atoms/counters/Counter.tsx
import React from 'react';
import { CounterText } from './counter.styles';
import { CounterProps } from './counter.types';

const Counter: React.FC<CounterProps> = ({ value, variant='default', ...rest }) => (
	<CounterText data-variant={variant} {...rest}>{value}</CounterText>
);

export default Counter;

