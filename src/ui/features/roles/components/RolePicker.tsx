import React from 'react';
import { ListItemText } from '@mui/material';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Text from '../../../shared/atoms/typography/Text';
import { CheckboxContainer } from '../assignRolesToUser.styles';
import type { Role } from '../AssignRolesToUser';

interface Props {
	roles: Role[];
	selected: string[];
	onChange: (ids: string[]) => void;
}

const RolePicker: React.FC<Props> = ({ roles, selected, onChange }) => {
	return (
		<SmartBox column p="px4" mb="px1" radius="sm2x" shadow="sm" sx={{ backgroundColor: 'background.paper' }}>
			<Text headingLevel="h3" system="sans" sx={{ mb: 1 }}>Seleccionar Roles</Text>

			<SmartBox column >
				{roles.map(role => (
					<CheckboxContainer key={role._id}>
						<input
							type="checkbox"
							value={role._id}
							checked={selected.includes(role._id)}
							onChange={(e) => {
								const id = e.target.value;
								onChange(selected.includes(id) ? selected.filter(r => r !== id) : [...selected, id]);
							}}
							aria-label={`Rol ${role.name}`}
						/>
						<ListItemText primary={role.name} />
					</CheckboxContainer>
				))}
			</SmartBox>
		</SmartBox>
	);
};

export default RolePicker;

