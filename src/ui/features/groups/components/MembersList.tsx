// src/ui/features/groups/components/MembersList.tsx
import React from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Text from '../../../shared/atoms/typography/Text';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import TextItemRow from '../../../shared/molecules/items/TextItemRow';
import AvatarX from '../../../shared/atoms/avatar/AvatarX';
import Badge from '../../../shared/atoms/badges/Badge';
import GroupMemberActionsMenu from '../GroupMemberActionsMenu';

import type { User } from '../../../../types/User';

type Props = {
	members: User[];
	canManageMembers: boolean;
	canManageAdmins: boolean;
	isMemberCreator: (m: User) => boolean;
	isMemberAdmin: (m: User) => boolean;
	onRefresh: () => void;
	onQuickRemove: (userId: string) => Promise<void> | void;
	onQuickGrant:  (userId: string) => Promise<void> | void;
	onQuickRevoke: (userId: string) => Promise<void> | void;
};

const MembersList: React.FC<Props> = ({
	members,
	canManageMembers,
	canManageAdmins,
	isMemberCreator,
	isMemberAdmin,
	onRefresh,
	onQuickRemove,
	onQuickGrant,
	onQuickRevoke,
}) => {
	return (
		<SmartBox column>
			<SmartBox between center sx={{ mb: 1 }}>
				<Text as="h3" headingLevel="h3" weight="bold">
					Miembros
				</Text>
				<FilledButton onClick={onRefresh} colorType="primary">
					Refrescar
				</FilledButton>
			</SmartBox>

			{members.length === 0 ? (
				<Text size="sm" colorKey="text.secondary">
					Aún no hay miembros en este grupo.
				</Text>
			) : (
				<SmartBox column sx={{ gap: 1 }}>
					{members.map((m) => {
						const creator = isMemberCreator(m);
						const admin   = isMemberAdmin(m);

						return (
							<TextItemRow
								key={m._id}
								startAdornment={<AvatarX src={(m as any).avatarUrl} alt={m.username} size="sm" />}
								label={m.username}
								description={m.email}
								meta={
									<SmartBox row sx={{ gap: 0.5 }}>
										{creator && (
											<Badge variant="soft" color="warning" size="sm" shape="rounded">
												Creador
											</Badge>
										)}
										{admin && !creator && (
											<Badge variant="soft" color="primary" size="sm" shape="rounded">
												Admin
											</Badge>
										)}
									</SmartBox>
								}
								endAdornment={
									<GroupMemberActionsMenu
										canManageMembers={canManageMembers}
										canManageAdmins={canManageAdmins}
										isCreator={creator}
										isAdmin={admin}
										onRemove={() => onQuickRemove(m._id)}
										onGrantAdmin={() => onQuickGrant(m._id)}
										onRevokeAdmin={() => onQuickRevoke(m._id)}
									/>
								}
								size="md"
								sx={{
									p: 1,
									borderRadius: '8px',
									border: '1px solid',
									borderColor: 'divider',
									columnGap: 1,
									rowGap: { xs: 0.5, sm: 0 },
								}}
							/>
						);
					})}
				</SmartBox>
			)}
		</SmartBox>
	);
};

export default MembersList;

