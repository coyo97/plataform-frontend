import React from 'react';
import Badge from '../../atoms/badges/Badge';
import { Row } from './metaBadgesRow.styles';
import type { MetaBadgesRowProps } from './metaBadgesRow.types';

/** Presentación genérica: la lógica de mapeo (estado→badge) queda en cada dominio. */
const MetaBadgesRow: React.FC<MetaBadgesRowProps> = ({ items, className }) => (
	<Row className={className}>
		{items.map((b, i) => (
			<Badge
				key={`${b.label}-${i}`}
				variant={b.variant ?? 'soft'}
				color={b.color ?? 'info'}
				size="sm"
				shape="rounded"
			>
				{b.label}
			</Badge>
		))}
	</Row>
);

export default MetaBadgesRow;

