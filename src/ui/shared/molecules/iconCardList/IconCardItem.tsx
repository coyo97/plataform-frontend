import React from 'react';
import Check    from '../../atoms/checks/Check';
import { CounterText } from '../../atoms/counters/counter.styles';
import {
	CardWrapper,
	TextBox,
} from './iconCardList.styles';
import type { IconCardItemData } from './iconCardList.types';

interface Props extends IconCardItemData {
	onToggle : (id: string, checked: boolean) => void;
}

const IconCardItem: React.FC<Props> = ({
	id, title, subtitle, description, icon,
	selected = false, onToggle,
}) => (
	<CardWrapper
		$selected={selected}
		role="checkbox"
		aria-checked={selected}
		tabIndex={0}
		onClick={() => onToggle(id, !selected)}
		onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && onToggle(id, !selected)}
	>
		<Check
			checked={selected}
			onChange={val => onToggle(id, val)}
			variant="success"
		/>

		{icon && <div style={{ fontSize: 28 }}>{icon}</div>}

		<TextBox>
			<strong>{title}</strong>
			{subtitle && <span>{subtitle}</span>}
			{description && (
				<small style={{ color: '#666' }}>{description}</small>
			)}
		</TextBox>
	</CardWrapper>
);

export default React.memo(IconCardItem);

