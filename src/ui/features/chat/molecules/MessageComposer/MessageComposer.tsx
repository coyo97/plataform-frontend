// ui/features/chat/molecules/MessageComposer/MessageComposer.tsx
import React, { useState, useRef } from 'react';

import TextField from '../../../../shared/atoms/textFields/TextField';
import IconButton from '../../../../shared/atoms/buttons/iconButton/IconButton';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';
import PaperclipIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

import {
	Bar,
	HiddenFile
} from './messageComposer.styles';

import type { MessageComposerProps } from './messageComposer.types';

const MessageComposer: React.FC<MessageComposerProps> = ({
	onSend,
	onSendFile
}) => {
	const [text, setText] = useState('');
	const fileRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e:React.FormEvent) => {
		e.preventDefault();
		if (text.trim()) {
			onSend(text.trim());
			setText('');
		}
	};

	const handleFile = (e:React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (f) onSendFile(f, text);
		setText('');
		if (fileRef.current) fileRef.current.value = '';
	};

	return (
		<Bar as="form" onSubmit={handleSubmit}>
			<HiddenFile ref={fileRef} type="file" onChange={handleFile} />

			<IconButton
				ariaLabel="Adjuntar archivo"
				onClick={()=>fileRef.current?.click()}
				sizeType="sm"
				shape="circle"
			>
				<PaperclipIcon fontSize="small" />
			</IconButton>

			<TextField
				value={text}
				onChange={setText}
				placeholder="Escribe un mensaje…"
				size="small"
				
			/>

			<FilledButton type="submit" colorType="primary" btnVariant="default" shape="circle">
				<SendIcon fontSize="small" />
			</FilledButton>
		</Bar>
	);
};

export default MessageComposer;

