import React, { useState } from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import TextField from '../../../shared/atoms/textFields/TextField';
import FileButton from '../../../shared/atoms/buttons/fileButton/FileButton';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';

import ModerationAlert from '../../../shared/molecules/moderation/ModerationAlert';
import { resolveErrorMessage } from '../../../shared/utils/validation/moderationError';

interface Props {
	onSend(content: string, file?: File): void | Promise<void>;
}

const HelpResponseForm: React.FC<Props> = ({ onSend }) => {
	const [content, setContent] = useState('');
	const [file, setFile] = useState<File | undefined>();
	const [loading, setLoading] = useState(false);

	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const handleSend = async () => {
		const trimmed = content.trim();
		if (!trimmed && !file) return; // no enviamos vacío

		setErrorMsg(null);
		setLoading(true);
		try {
			await Promise.resolve(onSend(trimmed, file));
			// si todo sale bien, limpiamos
			setContent('');
			setFile(undefined);
		} catch (err) {
			console.error('Error al enviar respuesta de ayuda:', err);

			const userMsg = resolveErrorMessage(err, {
				generic   : 'No se pudo enviar la respuesta. Inténtalo nuevamente.',
				moderation: 'La respuesta fue bloqueada por moderación. Revisa que el texto y el archivo adjunto cumplan las políticas.',
				fileType  : 'Tipo de archivo no permitido en la respuesta. Revisa las extensiones soportadas.',
				fileSize  : 'El archivo que intentas adjuntar en la respuesta es demasiado grande.',
			});

			setErrorMsg(userMsg);
			// MUY IMPORTANTE: NO re-lanzamos el error -> así evitamos el "Uncaught (in promise)"
		} finally {
			setLoading(false);
		}
	};

	return (
		<SmartBox column gap="px8">
			{/* alerta solo para este form de respuesta */}
			<ModerationAlert
				message={errorMsg}
				onClose={() => setErrorMsg(null)}
			/>

			<TextField
				multiline
				rows={4}
				value={content}
				onChange={setContent}
				placeholder="Escribe tu respuesta…"
			/>

			<SmartBox row gap="px8" alignItems="center">
				<FileButton
					onChange={e => e.target.files && setFile(e.target.files[0])}
				/>
				<FilledButton
					size="small"
					colorType="primary"
					disabled={loading || !content.trim()}
					onClick={handleSend}
				>
					{loading ? 'Verificando…' : 'Publicar respuesta'}
				</FilledButton>
			</SmartBox>
		</SmartBox>
	);
};

export default HelpResponseForm;

