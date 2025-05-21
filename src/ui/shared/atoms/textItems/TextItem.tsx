import React from 'react';
import Check from '../checks/Check';
import {
	TextItemWrapper,
	UsernameText,
	TextItemContent,
} from './textItem.styles';
import { TextItemProps } from './textItem.types';

// Mapeo interno de variante visual
const mapVariantToCheck = (v: TextItemProps['variant']) => {
	switch (v) {
		case 'error':
			return 'danger';
		default:
			return v;
	}
};

const TextItem: React.FC<TextItemProps> = ({
	username,
	text,
	checked,
	onCheckChange,
	variant = 'default',
	disabled = false,
}) => {
	return (
		<TextItemWrapper variant={variant} disabled={disabled}>
			<Check
				checked={checked}
				onChange={onCheckChange}
				disabled={disabled}
				variant={mapVariantToCheck(variant)}
			/>

			<TextItemContent>
				<UsernameText>{username}</UsernameText>
				{text}
			</TextItemContent>
		</TextItemWrapper>
	);
};

export default TextItem;

