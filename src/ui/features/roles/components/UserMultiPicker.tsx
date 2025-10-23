import React from 'react';
import { Autocomplete, Chip, TextField } from '@mui/material';
import type { User } from '../AssignRolesToUser';

interface Props {
	users: User[];
	valueIds: string[];
	onChangeIds: (ids: string[]) => void;
}

const UserMultiPicker: React.FC<Props> = ({ users, valueIds, onChangeIds }) => {
	const value = users.filter(u => valueIds.includes(u._id));

	return (
		<Autocomplete
			multiple
			options={users}
			value={value}
			onChange={(_, values) => onChangeIds(values.map(v => v._id))}
			isOptionEqualToValue={(opt, val) => opt._id === val._id}
			disableCloseOnSelect
			getOptionLabel={(u) => `${u.username ?? '(sin nombre)'} (${u.email ?? '—'})`}
			renderTags={(value, getTagProps) =>
				value.map((option, index) => (
					<Chip {...getTagProps({ index })} key={option._id} label={option.username ?? option.email ?? option._id} />
			))
			}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Selecciona uno o varios usuarios"
					helperText="Puedes tipear para filtrar rápidamente"
				/>
			)}
			ListboxProps={{ style: { maxHeight: 400 } }}
		/>
	);
};

export default UserMultiPicker;

