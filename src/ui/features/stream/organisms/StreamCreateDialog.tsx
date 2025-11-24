// src/ui/features/stream/organisms/StreamCreateDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import StreamCreateForm from './StreamCreateForm';
import type { Stream } from '../../../../types/stream';

interface Props {
	open: boolean;
	onClose: () => void;
	fullScreen?: boolean;

	// Permisos y handlers externos
	canCreate: boolean;
	onCreated: (id: string, accessCode?: string, stream?: Stream) => void;
	onPermissionDenied?: (msg: string) => void;
}

const StreamCreateDialog: React.FC<Props> = ({
	open,
	onClose,
	fullScreen = false,
	canCreate,
	onCreated,
	onPermissionDenied,
}) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullScreen={fullScreen}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Nuevo stream</DialogTitle>

			<DialogContent>
				<StreamCreateForm
					onStreamCreated={(id, access, stream) => {
						onCreated(id, access, stream as Stream | undefined);
						onClose();
					}}
					canCreate={canCreate}
					onPermissionDenied={onPermissionDenied}
				/>
			</DialogContent>

			{/* Lo dejo sin acciones visibles, igual que en publicaciones */}
			<DialogActions />
		</Dialog>
	);
};

export default React.memo(StreamCreateDialog);

