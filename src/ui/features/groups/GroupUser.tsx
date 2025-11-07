// src/ui/features/groups/GroupUser.page.tsx
import React from 'react';
import Text from '../../shared/atoms/typography/Text';
import Loader from '../../shared/atoms/feedback/loader/Loader';
import Alert from '../../shared/atoms/feedback/alert/Alert';
import GridContainer from '../../shared/atoms/grid/GridContainer';
import GridColumn from '../../shared/atoms/grid/GridColumn';
import SmartBox from '../../shared/atoms/box/SmartBox';

import GroupSelector from './components/GroupSelector';
import MembersList from './components/MembersList';
import AddUserForm from './components/AddUserForm';
import RemoveUserForm from './components/RemoveUserForm';
import AdminPermissions from './components/AdminPermissions';
import AccordionSection from '../../shared/molecules/accordionSection/AccordionSection';

import { useGroupUser } from './hooks/useGroupUser';

const GroupUser: React.FC = () => {
	const {
		// datos
		groups, users, members, selectedGroup,
		// ids
		groupId, setGroupId,
		userToAdd, setUserToAdd,
		userToRemove, setUserToRemove,
		adminTarget, setAdminTarget,
		// estado
		loading, error, setError, message, setMessage,
		// permisos
		canManageMembers, canManageAdmins,
		// helpers
		isMemberCreator, isMemberAdmin, getUserOptionLabel, renderUserOption,
		// acciones
		handleSelectGroup,
		handleAdd, handleRemove, handleGrantAdmin, handleRevokeAdmin,
		handleQuickRemove, handleQuickGrant, handleQuickRevoke,
	} = useGroupUser();

	return (
		<GridContainer variant="desktopFluid" columns={{ xs: 4, sm: 6, md: 12 }}>
			{/* Título */}
			<GridColumn span={{ xs: 4, sm: 6, md: 12 }}>
				<Text as="h1" headingLevel="h3" weight="bold" sx={{ mb: 3 }}>
					Gestión de Usuarios de Grupos
				</Text>
			</GridColumn>

			{/* Feedback global */}
			<GridColumn span={{ xs: 4, sm: 6, md: 12 }}>
				<SmartBox role="status" aria-live="polite" sx={{ mb: 2 }}>
					{loading && <Loader />}
					{error   && <Alert type="error"   onClose={() => setError(null)}>{error}</Alert>}
					{message && <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>}
				</SmartBox>
			</GridColumn>

			{/* Selector de grupo */}
			<GridColumn span={{ xs: 4, sm: 6, md: 12 }}>
				<GroupSelector
					groups={groups}
					groupId={groupId}
					onSelect={handleSelectGroup}
				/>
			</GridColumn>

			{/* Miembros + Acciones */}
			{groupId && (
				<>
					{/* Izquierda: Miembros */}
					<GridColumn span={{ xs: 4, sm: 6, md: 7 }}>
						<MembersList
							members={members}
							canManageMembers={canManageMembers}
							canManageAdmins={canManageAdmins}
							isMemberCreator={isMemberCreator}
							isMemberAdmin={isMemberAdmin}
							onRefresh={() => selectedGroup && setGroupId(selectedGroup._id)}
							onQuickRemove={handleQuickRemove}
							onQuickGrant={handleQuickGrant}
							onQuickRevoke={handleQuickRevoke}
						/>
					</GridColumn>

					{/* Derecha: Acciones */}
					<GridColumn span={{ xs: 4, sm: 6, md: 5 }}>
						{canManageMembers && (
							<AccordionSection title="Acciones de miembros">
								<SmartBox column sx={{ gap: 2 }}>
									<AddUserForm
										users={users}
										userToAdd={userToAdd}
										setUserToAdd={setUserToAdd}
										getUserOptionLabel={getUserOptionLabel}
										renderUserOption={renderUserOption}
										onSubmit={handleAdd}
										// loading opcional si usas búsqueda remota
									/>
									<RemoveUserForm
										members={members}
										userToRemove={userToRemove}
										setUserToRemove={setUserToRemove}
										getUserOptionLabel={getUserOptionLabel}
										renderUserOption={renderUserOption}
										onSubmit={handleRemove}
									/>
								</SmartBox>
							</AccordionSection>
						)}

						{canManageAdmins && (
							<SmartBox sx={{ mt: 1 }}>
								<AdminPermissions
									members={members}
									adminTarget={adminTarget}
									setAdminTarget={setAdminTarget}
									getUserOptionLabel={getUserOptionLabel}
									renderUserOption={renderUserOption}
									onGrant={handleGrantAdmin}
									onRevoke={handleRevokeAdmin}
								/>
							</SmartBox>
						)}
					</GridColumn>
				</>
			)}
		</GridContainer>
	);
};

export default GroupUser;

