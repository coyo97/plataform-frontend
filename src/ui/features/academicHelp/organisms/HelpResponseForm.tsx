import React, { useState } from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import TextField from '../../../shared/atoms/textFields/TextField';
import FileButton from '../../../shared/atoms/buttons/fileButton/FileButton';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';

interface Props { onSend(content: string, file?: File): void; }
const HelpResponseForm: React.FC<Props> = ({ onSend }) => {
	const [content, setContent] = useState('');
	const [file, setFile] = useState<File|undefined>();

	return (
		<SmartBox column gap="px8">
			<TextField
				multiline rows={4} value={content}
				onChange={setContent} placeholder="Escribe tu respuesta…"
			/>
			<SmartBox row gap="px8" alignItems="center">
				<FileButton onChange={e => e.target.files && setFile(e.target.files[0])} />
				<FilledButton
					size="small"
					colorType="primary"
					disabled={!content.trim()}
					onClick={() => { onSend(content.trim(), file); setContent(''); setFile(undefined); }}
				>
					Publicar respuesta
				</FilledButton>
			</SmartBox>
		</SmartBox>
	);
};
export default HelpResponseForm;

