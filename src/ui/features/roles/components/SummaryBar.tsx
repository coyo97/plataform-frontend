import React from 'react';
import { Box, LinearProgress } from '@mui/material';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Text from '../../../shared/atoms/typography/Text';
import type { Role } from '../AssignRolesToUser';

interface Props {
	mode: 'single' | 'bulk';
	roles: Role[];
	selectedRoles: string[];
	selectedCount: number;
	loading: boolean;
	progress: { done: number; total: number; fails: number };
}

const SummaryBar: React.FC<Props> = ({ mode, roles, selectedRoles, selectedCount, loading, progress }) => {
	const roleNames = selectedRoles.length > 0
		? selectedRoles.map(id => roles.find(r => r._id === id)?.name || id).join(', ')
		: '—';

		return (
			<SmartBox
				row between 
				p="px2" radius="sm3x" shadow="sm"
				sx={{ position: 'sticky', bottom: 0, backgroundColor: 'background.paper', mt: 'px2', gap: 8, zIndex: 1 }}
			>
				<Text size="sm"><b>Modo:</b> {mode === 'single' ? 'Individual' : 'Masiva'}</Text>
				<Text size="sm"><b>Seleccionados:</b> {selectedCount}</Text>
				<Text size="sm"><b>Roles:</b> {roleNames}</Text>
				{loading && (
					<Box sx={{ flex: 1, mx: 2 }}>
						<LinearProgress />
						<Text size="xs" colorKey="text.secondary">
							Progreso: {progress.done}/{progress.total} · errores: {progress.fails}
						</Text>
					</Box>
				)}
			</SmartBox>
		);
};

export default SummaryBar;

