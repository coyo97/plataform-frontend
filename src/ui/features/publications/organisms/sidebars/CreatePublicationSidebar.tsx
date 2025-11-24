// src/ui/features/publications/organisms/sidebars/CreatePublicationSidebar.tsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../shared/organisms/sidebar/Sidebar';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';
import CreatePublicationDialog from '../CreatePublicationDialog';
import { fetchCareers, createPublication, updatePublication } from '../../../../../async/services/publicationService';
import type { Career, Publication } from '../../../../../types/publication';
import { Alert, useMediaQuery } from '@mui/material';
import { breakPoints } from '../../../../../config/mq';
import { getPermissionMessage } from '../../../../shared/messages/permissionMessages';

interface Props {
	onNew   : (pub: Publication) => void;
	open    : boolean;
	onClose : () => void;
	editPublication?: Publication | null;
	editingOpen?: boolean;
	onEditingClose?: () => void;
	onUpdated?: (p: Publication) => void;
	onShowMyPosts: () => void;
	onShowAll?: () => void;
	onlyMine?: boolean;
	canCreate?: boolean;
}

const CreatePublicationSidebar: React.FC<Props> = ({
	onNew, open, onClose,
	editPublication = null, editingOpen = false, onEditingClose, onUpdated,onShowMyPosts, onShowAll, onlyMine = false, canCreate = true,
}) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [careers, setCareers] = useState<Career[]>([]);
	const [permissionMsg, setPermissionMsg] = useState<string | null>(null);

	useEffect(() => { fetchCareers().then(setCareers).catch(console.error); }, []);

	const isMobile = useMediaQuery(`(max-width:${breakPoints.values.sm - 1}px)`);



	const handleCreate = async (fd: FormData) => {
		const pub = await createPublication(fd);
		onNew(pub);
		return pub;
	};

	const handleUpdate = async (fd: FormData) => {
		if (!editPublication) throw new Error('No publication to edit');
		const updated = await updatePublication(editPublication._id, fd);
		onUpdated?.(updated);
		return updated;
	};

	const isEditing = !!editingOpen && !!editPublication;

	const handleClickCreateButton = () => {
		if (!canCreate) {
			setPermissionMsg(getPermissionMessage('createDenied'));
			return;
		}
		setDialogOpen(true);
	};

	return (
		<Sidebar sticky open={open} variant="flat" onClose={onClose} width={isMobile ? 180: 180}>
			<SmartBox>
				{permissionMsg && (
					<Alert
						severity="warning"
						onClose={() => setPermissionMsg(null)}
						sx={{ mb: 1 }}
					>
						{permissionMsg}
					</Alert>
				)}
				<FilledButton
					colorType="primary"
					btnVariant="default"
					fullWidth
					onClick={handleClickCreateButton}
					aria-disabled={!canCreate}
					sx={
						!canCreate
							? {
								opacity: 0.55,
								cursor: 'not-allowed',
								pointerEvents: 'auto',
							}
							: undefined
					}
				>
					Publicar
				</FilledButton>
				<FilledButton
					colorType="secondary"
					btnVariant="light"
					fullWidth
					style={{ marginTop: 8 }}
					onClick={onlyMine ? (onShowAll ?? (()=>{})) : onShowMyPosts}
				>
					{onlyMine ? 'Ver todas' : 'Mis publicaciones'}
				</FilledButton>
			</SmartBox>

			<CreatePublicationDialog
				open={canCreate ? (isEditing ? true : dialogOpen) : false}
				onClose={() => (isEditing ? onEditingClose?.() : setDialogOpen(false))}
				careers={careers}
				onNew={onNew}
				onSubmit={isEditing ? handleUpdate : handleCreate}
				/* edición */
				mode={isEditing ? 'edit' : 'create'}
				publication={editPublication ?? undefined}
				onUpdated={onUpdated}
			/>
		</Sidebar>
	);
};

export default CreatePublicationSidebar;

