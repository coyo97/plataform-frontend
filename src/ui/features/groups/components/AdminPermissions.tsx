// src/ui/features/groups/components/AdminPermissions.tsx
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SecurityIcon from '@mui/icons-material/Security';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import AccordionSection from '../../../shared/molecules/accordionSection/AccordionSection';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import type { User } from '../../../../types/User';

type Props = {
	members: User[];
	adminTarget: string;
	setAdminTarget: (id: string) => void;
	getUserOptionLabel: (u: User | null) => string;
	renderUserOption: (props: React.HTMLAttributes<HTMLLIElement>, u: User) => { props: any; u: User; creator: boolean; admin: boolean };
	onGrant: (e: React.FormEvent) => void;
	onRevoke: (e: React.FormEvent) => void;
};

const AdminPermissions: React.FC<Props> = ({
	members,
	adminTarget,
	setAdminTarget,
	getUserOptionLabel,
	renderUserOption,
	onGrant,
	onRevoke,
}) => (
	<AccordionSection title="Permisos de administrador">
		{/* Selector de miembro objetivo */}
		<SmartBox row sx={{ gap: 2, mb: 1 }}>
			<Autocomplete
				size="small"
				options={members}
				value={members.find(m => m._id === adminTarget) ?? null}
				onChange={(_, opt) => setAdminTarget((opt as User | null)?._id ?? '')}
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
						label="Miembro objetivo"
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
		</SmartBox>

		{/* Botones */}
		<SmartBox row sx={{ gap: 2 }}>
			<Tooltip title={adminTarget ? '' : 'Selecciona un miembro'} arrow placement="top">
				<span style={{ display: 'inline-block' }}>
					<FilledButton
						onClick={onGrant}
						colorType="warning"
						startIcon={<SecurityIcon />}
						disabled={!adminTarget}
					>
						Hacer admin
					</FilledButton>
				</span>
			</Tooltip>

			<Tooltip title={adminTarget ? '' : 'Selecciona un miembro'} arrow placement="top">
				<span style={{ display: 'inline-block' }}>
					<FilledButton
						onClick={onRevoke}
						colorType="secondary"
						startIcon={<RemoveModeratorIcon />}
						disabled={!adminTarget}
					>
						Revocar admin
					</FilledButton>
				</span>
			</Tooltip>
		</SmartBox>
	</AccordionSection>
);

export default AdminPermissions;

