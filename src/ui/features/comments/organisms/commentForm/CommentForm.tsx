// src/ui/features/comments/CommentForm/CommentForm.tsx
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import TextField from '../../../../shared/atoms/textFields/TextField';

interface Props {
	onSubmit: (text: string) => void | Promise<void>;
}

const CommentForm: React.FC<Props> = ({ onSubmit }) => {
	const [text, setText] = useState('');

	const handleSubmit = async () => {
		if (!text.trim()) return;
		await onSubmit(text.trim());
		setText('');
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2, py: 1 }}>
			<TextField
				label="Comentario"
				placeholder="Escribe tu comentario…"
				value={text}
				onChange={setText}
				size="large"
				type="text"
			/>
			<Button
				onClick={handleSubmit}
				disabled={!text.trim()}
				variant="contained"
				endIcon={<SendIcon />}
			>
				Comentar
			</Button>
		</Box>
	);
};

export default CommentForm;

