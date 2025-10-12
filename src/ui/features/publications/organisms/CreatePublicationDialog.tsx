// src/ui/features/publications/organisms/CreatePublicationDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React  from 'react';
import CreatePublicationForm from './createPublicationForm/CreatePublicationForm';
import { Career, Publication } from '../../../../types/publication';

interface Props {
	open     : boolean;
	onClose  : () => void;
	careers  : Career[];
	onSubmit : (fd: FormData) => Promise<Publication>;
	onNew    : (pub: Publication) => void;
	fullScreen?: boolean;

	// OPCIONALES para edición:
	mode?: 'create' | 'edit';
	publication?: Publication;
	onUpdated?: (p: Publication) => void;
}

const CreatePublicationDialog: React.FC<Props> = ({
	open, onClose, careers, onSubmit, onNew, fullScreen = false,
	mode = 'create', publication, onUpdated,
}) => (
	<Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
		<DialogTitle>{mode === 'edit' ? 'Editar publicación' : 'Nueva publicación'}</DialogTitle>

		<DialogContent>
			<CreatePublicationForm
				careers={careers}
				onSubmit={onSubmit}
				onCreated={(p)=>{ onNew(p); onClose(); }}
				/* edición */
				mode={mode}
				publicationId={publication?._id}
				initial={publication}
				onUpdated={(p)=>{ onUpdated?.(p); onClose(); }}
			/>
		</DialogContent>

	{!fullScreen && (
		<DialogActions>
			<Button onClick={onClose}>Salir</Button>
		</DialogActions>
	)}
	</Dialog>
);

export default React.memo(CreatePublicationDialog);

