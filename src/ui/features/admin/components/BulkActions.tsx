import React from 'react';
import { Box, ButtonGroup } from '@mui/material';
import Text from '../../../shared/atoms/typography/Text';
import { ActionButton } from '../userManagement.styles';

interface Props {
	hasUsers: boolean;
	onBulkAction: (action: 'deactivate' | 'reactivate' | 'blacklist') => void;
}

export const BulkActions: React.FC<Props> = ({ hasUsers, onBulkAction }) => {
	if (!hasUsers) return null;
	return (
		<Box sx={{ mb: 2 }}>
			<Text as="div" size="md" weight="medium" sx={{ mb: 1 }}>
				Acciones Masivas:
			</Text>
			<ButtonGroup
				variant="contained"
				color="primary"
				sx={{ gap: 1, '& .MuiButton-root': { borderRadius: '8px !important' } }}
			>
				<ActionButton onClick={() => onBulkAction('deactivate')}>
					<Text as="span" size="sm" weight="medium" colorKey="common.white">Desactivar Todos</Text>
				</ActionButton>
				<ActionButton onClick={() => onBulkAction('reactivate')}>
					<Text as="span" size="sm" weight="medium" colorKey="common.white">Reactivar Todos</Text>
				</ActionButton>
				<ActionButton onClick={() => onBulkAction('blacklist')}>
					<Text as="span" size="sm" weight="medium" colorKey="common.white">Bloquear Todos</Text>
				</ActionButton>
			</ButtonGroup>
		</Box>
	);
};
