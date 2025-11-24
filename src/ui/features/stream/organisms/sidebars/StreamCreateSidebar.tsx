// src/ui/features/stream/organisms/sidebars/StreamCreateSidebar.tsx
import React, { useState } from 'react';
import { useMediaQuery } from '@mui/material';

import Sidebar from '../../../../shared/organisms/sidebar/Sidebar';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';

import StreamCreateDialog from '../StreamCreateDialog';

import type { Stream } from '../../../../../types/stream';
import { breakPoints } from '../../../../../config/mq';
import { getPermissionMessage } from '../../../../shared/messages/permissionMessages';

interface Props {
	open: boolean;
	onClose: () => void;

	canCreate: boolean;

	onStreamCreated: (id: string, accessCode?: string, stream?: Stream) => void;
	onPermissionDenied?: (msg: string) => void;
}

const StreamCreateSidebar: React.FC<Props> = ({
	open,
	onClose,
	canCreate,
	onStreamCreated,
	onPermissionDenied,
}) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const isMobile = useMediaQuery(`(max-width:${breakPoints.values.sm - 1}px)`);

	const handleClickCreate = () => {
		if (!canCreate) {
			const msg = getPermissionMessage('createDenied');
			onPermissionDenied?.(msg);
			return;
		}
		setDialogOpen(true);
	};

	return (
		<Sidebar
			sticky
			open={open}
			onClose={onClose}
			variant="flat"
			width={isMobile ? 180 : 220}
		>
			<SmartBox column gap="px8">
				<FilledButton
					colorType="primary"
					btnVariant="default"
					fullWidth
					onClick={handleClickCreate}
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
					Iniciar stream
				</FilledButton>
				{/* Aquí podrías añadir luego: “Mis streams”, filtros, etc. */}
			</SmartBox>

			<StreamCreateDialog
				open={dialogOpen && canCreate}
				onClose={() => setDialogOpen(false)}
				canCreate={canCreate}
				onCreated={(id, access, stream) => {
					onStreamCreated(id, access, stream);
				}}
				onPermissionDenied={onPermissionDenied}
			/>
		</Sidebar>
	);
};

export default StreamCreateSidebar;

