import React, { useState, useEffect } from 'react';
import MainInput from '../../../../shared/atoms/inputs/MainInput'; //
import CareerSelector from '../../../../shared/molecules/selector/CareerSelector';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';
import FileButton from '../../../../shared/atoms/buttons/fileButton/FileButton';
import PublicationFormBody from '../../../../shared/atoms/form/PublicationFormBody';
import PublicationFormActions from '../../../../shared/atoms/form/PublicationFormActions';
import { useModerationAlert } from '../../../../shared/hooks/useModerationAlert';

import {
	Box, Typography, LinearProgress, Button, Avatar
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import type { Career, Publication } from '../../../../../types/publication';

interface Props {
	careers  : Career[];
	onSubmit : (fd: FormData) => Promise<Publication>;
	onCreated: (p: Publication) => void;
}

const CreatePublicationForm: React.FC<Props> = ({
	careers, onSubmit, onCreated,
}) => {
	const [title, setTitle]     = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags]       = useState('');
	const [file, setFile]       = useState<File | null>(null);
	const [careerId, setCareer] = useState('');

	const [preview, setPreview]  = useState<string>('');   // mini-preview
	const [uploading, setUploading] = useState(false);     // spinner/barra
	const showModerationAlert = useModerationAlert();

	/* genera/limpia la URL de preview */
	useEffect(() => {
		if (!file) { setPreview(''); return; }
		const url = URL.createObjectURL(file);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	const handle = async (e: React.FormEvent) => {
		e.preventDefault();
		if (uploading) return;
		const fd = new FormData();
		fd.append('title', title);
		fd.append('content', content);
		if (file) fd.append('file', file);
		fd.append(
			'tags',
			JSON.stringify(tags.split(',').map(t => t.trim())),
		);
		if (careerId) fd.append('careerId', careerId);

		try {
			setUploading(true);
			const pub = await onSubmit(fd);
			onCreated(pub);   
			// reset
			setTitle('');
			setContent('');
			setTags('');
			setFile(null);
			setCareer('');

		} catch (err: any) {

			if (showModerationAlert(err)) return;

			console.error('Error al crear la publicación:', err);
		}
		finally {
			setUploading(false);          // 👈 oculta spinner/barra
		}
	};

	return (
		<form onSubmit={handle}>
			<PublicationFormBody>
				<MainInput
					label="Título"
					value={title}
					onChange={setTitle}
					placeholder="Ej: Apuntes de cálculo diferencial"
					error={title.length === 0 ? 'El título es requerido' : undefined}
				/>

				<MainInput
					label="Contenido"
					value={content}
					onChange={setContent}
					placeholder="Describe brevemente el contenido del material…"
					multiline
					rows={4}
					error={content.length === 0 ? 'El contenido no puede estar vacío' : undefined}
				/>

				<MainInput
					label="Etiquetas"
					value={tags}
					onChange={setTags}
					placeholder="Ej: física, integración, ejercicios"
					hint="Separar por comas"
				/>

				<FileButton onChange={e => e.target.files && setFile(e.target.files[0])} />
				{/* Preview */}
				{preview && file && (
					file.type.startsWith('image/') ? (
						<Avatar
							variant="rounded"
							src={preview}
							sx={{ width: 80, height: 80, mb: 1 }}
						/>
					) : (
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
							<InsertDriveFileIcon color="action" />
							<Typography>{file.name}</Typography>
						</Box>
					)
				)}


				{/* Barra de progreso + mensaje */}
				{uploading && (
					<Box sx={{ my:1 }}>
						<LinearProgress/>
						<Typography variant="caption">
							Espera un momento, estamos verificando tu archivo…
						</Typography>
					</Box>
				)}

				<CareerSelector
					label="Carrera"
					careers={careers}
					value={careerId}
					onChange={setCareer}
					required
				/>
			</PublicationFormBody>

			<PublicationFormActions>
				<FilledButton variant="ghost" colorType="secondary" type="reset">
					Cancelar
				</FilledButton>
				<Button>

				</Button>
				<FilledButton
					variant="solid"
					colorType="primary"
					type="submit"
					disabled={uploading || !title || !content}
				>
					{uploading ? 'Verificando…' : 'Publicar'}
				</FilledButton>
			</PublicationFormActions>
		</form>
	);
};

export default CreatePublicationForm;
