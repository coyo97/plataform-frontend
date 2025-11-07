// src/ui/features/groups/components/RemoveUserForm.tsx
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import AccordionSection from '../../../shared/molecules/accordionSection/AccordionSection';
import type { User } from '../../../../types/User';

type Props = {
	members: User[];
	userToRemove: string;
	setUserToRemove: (id: string) => void;
	getUserOptionLabel: (u: User | null) => string;
	renderUserOption: (props: React.HTMLAttributes<HTMLLIElement>, u: User) => { props: any; u: User; creator: boolean; admin: boolean };
	onSubmit: (e: React.FormEvent) => void;
};

const RemoveUserForm: React.FC<Props> = ({
	members,
	userToRemove,
	setUserToRemove,
	getUserOptionLabel,
	renderUserOption,
	onSubmit,
}) => (
	<AccordionSection title="Eliminar usuario">
		<form onSubmit={onSubmit}>
			<SmartBox row sx={{ gap: 2 }}>
				<Autocomplete
					size="small"
					options={members}
					value={members.find(m => m._id === userToRemove) ?? null}
					onChange={(_, opt) => setUserToRemove((opt as User | null)?._id ?? '')}
					getOptionLabel={getUserOptionLabel}
					isOptionEqualToValue={(o, v) => o._id === v._id}
					renderOption={(props, u) => {
						const { props: liProps, u: user } = renderUserOption(props, u);
						return <li {...liProps}>{user.username} — {user.email}</li>;
					}}
					noOptionsText="No hay miembros"
					renderInput={(params) => (
						<TextField
							{...params}
							label="Miembro"
							placeholder="Buscar miembro…"
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

				<FilledButton type="submit" colorType="error" startIcon={<PersonRemoveIcon />}>
					Eliminar
				</FilledButton>
			</SmartBox>
		</form>
	</AccordionSection>
);

export default RemoveUserForm;

