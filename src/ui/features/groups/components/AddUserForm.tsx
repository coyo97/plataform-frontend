import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import AccordionSection from '../../../shared/molecules/accordionSection/AccordionSection';
import type { User } from '../../../../types/User';

type Props = {
	users: User[];
	userToAdd: string;
	setUserToAdd: (id: string) => void;
	getUserOptionLabel: (u: User | null) => string;
	renderUserOption: (
		props: React.HTMLAttributes<HTMLLIElement>,
		u: User
	) => { props: any; u: User; creator: boolean; admin: boolean };
	onSubmit: (e: React.FormEvent) => void;
	loading?: boolean;
};

const AddUserForm: React.FC<Props> = ({
	users,
	userToAdd,
	setUserToAdd,
	getUserOptionLabel,
	renderUserOption,
	onSubmit,
	loading,
}) => (
	<AccordionSection title="Agregar usuario">
		<form onSubmit={onSubmit}>
			<SmartBox row sx={{ gap: 2 }}>
				<Autocomplete
					size="small"
					options={users}
					value={users.find(u => u._id === userToAdd) ?? null}
					onChange={(_, opt) => setUserToAdd((opt as User | null)?._id ?? '')}
					getOptionLabel={getUserOptionLabel}
					isOptionEqualToValue={(o, v) => o._id === v._id}
					renderOption={(props, u) => {
						const { props: liProps, u: user } = renderUserOption(props, u);
						return (
							<li {...liProps}>
								{user.username} — {user.email}
							</li>
						);
					}}
					noOptionsText="Sin resultados"
					loading={!!loading && users.length === 0}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Usuario"
							placeholder="Buscar usuario…"
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

				<FilledButton type="submit" colorType="success" startIcon={<PersonAddIcon />}>
					Agregar
				</FilledButton>
			</SmartBox>
		</form>
	</AccordionSection>
);

export default AddUserForm;

