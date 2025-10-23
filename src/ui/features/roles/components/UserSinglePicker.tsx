import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { User } from '../AssignRolesToUser';

interface Props {
	users: User[];
	valueId: string;
	onChangeId: (id: string, user?: User | null) => void;
}

const UserSinglePicker: React.FC<Props> = ({ users, valueId, onChangeId }) => {
	const value = users.find(u => u._id === valueId) ?? null;

	return (
		<Autocomplete
			options={users}
			value={value}
			onChange={(_, val) => {
				if (val) {
					onChangeId(val._id, val);
				} else {
					onChangeId('', null);
				}
			}}
			isOptionEqualToValue={(opt, val) => opt._id === val._id}
			getOptionLabel={(u) => (u ? `${u.username ?? '(sin nombre)'} (${u.email ?? '—'})` : '')}
			renderInput={(params) => (
				<TextField {...params} label="Seleccionar Usuario" variant="outlined" />
			)}
			ListboxProps={{ style: { maxHeight: 360 } }}
		/>
	);
};

export default UserSinglePicker;

