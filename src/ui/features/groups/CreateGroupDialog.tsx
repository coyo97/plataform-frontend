import React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide  from '@mui/material/Slide';
import CreateGroupForm from './CreateGroupForm';

interface Props {
	open: boolean;
	onClose: () => void;
}

const CreateGroupDialog: React.FC<Props> = ({ open, onClose }) => (
	<Dialog
		open={open}
		onClose={onClose}
		fullWidth
		maxWidth="sm"
		TransitionComponent={Slide}
		fullScreen={false}          
	>
		<div style={{ padding: 24 }}>
			<CreateGroupForm onSuccess={onClose} />
		</div>
	</Dialog>
);

export default CreateGroupDialog;

