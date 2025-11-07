// src/ui/features/groups/components/GroupSelector.tsx
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Card from '../../../shared/organisms/card/Card';
import Text from '../../../shared/atoms/typography/Text';
import type { Group } from '../../../../types/types';

type Props = {
	groups: Group[];
	groupId: string;
	onSelect: (g: Group | null) => void;
};

const GroupSelector: React.FC<Props> = ({ groups, groupId, onSelect }) => (
	<Card
		title={
			<Text as="h3" headingLevel="h3" weight="bold" sx={{ mb: 1 }}>
				Seleccionar grupo
			</Text>
		}
		description={
			<Text size="sm" colorKey="text.secondary" sx={{ mb: 2 }}>
				Elige uno de tus grupos para ver y gestionar sus miembros.
			</Text>
		}
	>
		<SmartBox row between sx={{ gap: 2 }}>
			<Autocomplete
				size="small"
				options={groups}
				value={groups.find(g => g._id === groupId) ?? null}
				onChange={(_, opt) => onSelect(opt)}
				getOptionLabel={(g) => g?.name ?? ''}
				isOptionEqualToValue={(o, v) => o._id === v._id}
				noOptionsText="No tienes grupos"
				renderInput={(params) => (
					<TextField
						{...params}
						label="Grupo"
						placeholder="Buscar grupo…"
						required
					/>
				)}
				disablePortal={false}
				slotProps={{
					popper: { sx: (t) => ({ zIndex: t.zIndex.modal + 1 }) },
				paper:  { sx: { maxHeight: 320, overflow: 'auto' } },
				}}
				sx={{ flex: 1 }}
			/>
		</SmartBox>
	</Card>
);

export default GroupSelector;

