import {
	Dialog, DialogTitle, DialogContent, DialogActions,
	Button
} from '@mui/material';
import React  from 'react';

import CreatePublicationForm from './createPublicationForm/CreatePublicationForm';

import { Career, Publication } from '../../../../types/publication';

interface Props {
	open     : boolean;
	onClose  : () => void;
	careers  : Career[];
	onSubmit : (fd: FormData) => Promise<Publication>;
	onNew    : (pub: Publication) => void;
	fullScreen?: boolean;   // (opcional) para mobile
}

const CreatePublicationDialog: React.FC<Props> = ({
	open, onClose, careers, onSubmit, onNew, fullScreen = false,
}) => (
	<Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
		<DialogTitle>Nueva publicación</DialogTitle>

		<DialogContent>
			<CreatePublicationForm
				careers={careers}
				onSubmit={onSubmit}
				onCreated={(p)=>{ onNew(p); onClose(); }}
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

