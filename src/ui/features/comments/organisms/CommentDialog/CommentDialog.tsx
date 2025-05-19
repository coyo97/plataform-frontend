// ui/features/comments/organisms/CommentDialog/CommentDialog.tsx
import React, { useState, useEffect } from 'react';
import {
	Dialog, DialogTitle, DialogActions, Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CommentField from '../../atoms/commentField/CommentField';
import { Content } from './commentDialog.styles';
import TextField from '../../../../shared/atoms/textFields/TextField';

interface Props {
	open    : boolean;
	initial ?: string;
	title   : string;
	onClose : () => void;
	onSave  : (text:string) => Promise<void>|void;
}

const CommentDialog:React.FC<Props> = ({ open, initial='', title, onClose, onSave })=>{
	const [text,setText] = useState('');
	useEffect(()=>{ if(open) setText(initial); },[open,initial]);

	const save = async()=>{
		if(!text.trim()) return;
		await onSave(text.trim());
		setText('');
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth  PaperProps={{
			elevation: 4 // lg
			}}>
			<DialogTitle>{title}</DialogTitle>
			<Content>
				<TextField
					label="Comentario"
					placeholder="Escribe tu comentario…"
					value={text}
					onChange={setText}
					size="large"
					type="text"
				/>
			</Content>
			<DialogActions>
				<Button onClick={onClose}>Cancelar</Button>
				<Button variant="contained" endIcon={<SendIcon/>}
					onClick={save} disabled={!text.trim()}>
					Enviar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CommentDialog;

