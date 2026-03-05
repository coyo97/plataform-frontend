import React, { useState } from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import FileButton from '../../../shared/atoms/buttons/fileButton/FileButton';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import TextEditor from '../../../shared/atoms/inputs/TextEditor';

import ModerationAlert from '../../../shared/molecules/moderation/ModerationAlert';
import { resolveErrorMessage } from '../../../shared/utils/validation/moderationError';

interface Props {
	onSend(content: string, file?: File): void | Promise<void>;
}

const stripHtml = (html: string) =>
	html.replace(/<[^>]+>/g, '').replace(/\s+/g, '').trim();

const HelpResponseForm: React.FC<Props> = ({ onSend }) => {
	const [content, setContent] = useState('');              // ahora será HTML
	const [file, setFile] = useState<File | undefined>();
	const [loading, setLoading] = useState(false);

	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const handleSend = async () => {
		const textOnly = stripHtml(content);

		if (!textOnly && !file) return;

		setErrorMsg(null);
		setLoading(true);
		try {
			await Promise.resolve(onSend(content, file));

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
		} finally {
			setLoading(false);
		}
	};

	const hasContent = stripHtml(content).length > 0;

	return (
		<SmartBox column gap="px8">
			{/* alerta solo para este form de respuesta */}
			<ModerationAlert
				message={errorMsg}
				onClose={() => setErrorMsg(null)}
			/>

			<TextEditor
				label="Tu respuesta"
				placeholder="Escribe tu respuesta… puedes usar negritas, listas, etc."
				value={content}
				onChange={setContent}
				minHeight={120}
				toolbarOptions={{
					bold: true,
					italic: true,
					underline: true,
					bulletList: true,
					orderedList: true,
				}}
			/>

			<SmartBox row gap="px8" alignItems="center">
				<FileButton
					onChange={(e) => e.target.files && setFile(e.target.files[0])}
				/>
				<FilledButton
					size="small"
					colorType="primary"
					disabled={loading || (!hasContent && !file)}
					onClick={handleSend}
				>
					{loading ? 'Verificando…' : 'Publicar respuesta'}
				</FilledButton>
			</SmartBox>
		</SmartBox>
	);
};

export default HelpResponseForm;

