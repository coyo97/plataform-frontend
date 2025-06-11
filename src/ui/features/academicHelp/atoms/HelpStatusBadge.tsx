import React from 'react';
import Badge from '../../../shared/atoms/badges/Badge';

interface Props { status: 'open' | 'resolved'; }
const HelpStatusBadge: React.FC<Props> = ({ status }) => (
	<Badge
		variant="soft"
		color={status === 'open' ? 'warning' : 'success'}
		size="sm"
	>
		{status === 'open' ? 'Abierto' : 'Resuelto'}
	</Badge>
);
export default HelpStatusBadge;

