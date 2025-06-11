// ui/features/chat/atoms/EmptyState/EmptyState.tsx
import React from 'react';
import { Wrapper, Title, Message } from './emptyState.styles';
import type { EmptyStateProps } from './emptyState.types';

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => (
	<Wrapper>
		<hr />
		<Title>{title}</Title>
		<Message>{message}</Message>
	</Wrapper>
);

export default EmptyState;

