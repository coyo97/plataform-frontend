import React, { useState, useRef } from 'react';
import TextField     from '../../../../shared/atoms/textFields/TextField';
import FilledButton  from '../../../../shared/atoms/buttons/filledButton/FilledButton';
import SmartBox      from '../../../../shared/atoms/box/SmartBox';

interface Props {
	onSend: (text:string, file?:File|null)=>Promise<void>;
}

const SendMessageForm: React.FC<Props> = ({ onSend }) => {
	const [text, setText]   = useState('');
	const [file, setFile]   = useState<File|null>(null);
	const fileInput         = useRef<HTMLInputElement>(null);

	const handleSubmit = async (e:React.FormEvent) => {
		e.preventDefault();
		await onSend(text, file);
		setText('');
		setFile(null);
		if (fileInput.current) fileInput.current.value='';
	};

	return (
		<form onSubmit={handleSubmit}>
			<SmartBox row gap="px8" p="px8">
				<TextField
					placeholder="Escribe un mensaje…"
					value={text}
					onChange={setText}
				/>

				<input
					ref={fileInput}
					type="file"
					hidden
					onChange={e => setFile(e.target.files?.[0] ?? null)}
				/>
				<FilledButton
					type="button"
					shape="circle"
					size="small"
					onClick={() => fileInput.current?.click()}
				>
					📎
				</FilledButton>

				<FilledButton type="submit" shape="circle" size="small" colorType="success">
					➤
				</FilledButton>
			</SmartBox>
		</form>
	);
};

export default SendMessageForm;

