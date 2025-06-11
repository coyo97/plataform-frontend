import React, { useRef, useState } from 'react';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';
import TextField    from '../../../../shared/atoms/textFields/TextField';
import SmartBox     from '../../../../shared/atoms/box/SmartBox';

interface Props {
	onSend: (txt: string) => void;
	onFile: (file: File)  => void;
}

const SendBox: React.FC<Props> = ({ onSend, onFile }) => {
	const [txt,   setTxt]   = useState('');
	const fileRef = useRef<HTMLInputElement>(null);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (txt.trim()) { onSend(txt.trim()); setTxt(''); }
	};

	return (
		<form onSubmit={submit}>
			<SmartBox row p="px10" gap="px8">
				<TextField
					value={txt}
					onChange={setTxt}
					placeholder="Escribe…"
				/>

				<input
					type="file"
					ref={fileRef}
					style={{ display:'none' }}
					onChange={e => e.target.files && onFile(e.target.files[0])}
				/>

				<FilledButton type="button" onClick={()=>fileRef.current?.click()}>
					📎
				</FilledButton>
				<FilledButton type="submit">➤</FilledButton>
			</SmartBox>
		</form>
	);
};

export default SendBox;

