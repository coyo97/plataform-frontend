// src/ui/features/publications/organisms/createPublicationForm/CreatePublicationForm.tsx
import React, { useState, useEffect } from 'react';
import MainInput from '../../../../shared/atoms/inputs/MainInput';
import CareerSelector from '../../../../shared/molecules/selector/CareerSelector';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';
import FileButton from '../../../../shared/atoms/buttons/fileButton/FileButton';
import PublicationFormBody from '../../../../shared/atoms/form/PublicationFormBody';
import PublicationFormActions from '../../../../shared/atoms/form/PublicationFormActions';
import { Box, Typography, LinearProgress, Button, Avatar } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type { Career, Publication } from '../../../../../types/publication';

interface Props {
	careers  : Career[];
	onSubmit : (fd: FormData) => Promise<Publication>;
	onCreated: (p: Publication) => void;

	/** OPCIONALES: para modo edición (compatibles con el flujo actual) */
	mode?: 'create' | 'edit';
	publicationId?: string;
	initial?: Partial<Publication>;
	onUpdated?: (p: Publication) => void;
}

const CreatePublicationForm: React.FC<Props> = ({
	careers, onSubmit, onCreated,
	mode = 'create',
	publicationId,
	initial,
	onUpdated,
}) => {
	const [title, setTitle]     = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags]       = useState('');
	const [file, setFile]       = useState<File | null>(null);
	const [careerId, setCareer] = useState('');

	const [preview, setPreview] = useState<string>('');
	const [uploading, setUploading] = useState(false);

	/* Prefill cuando hay initial (modo edición) */
	useEffect(() => {
		if (!initial) return;
		setTitle(initial.title ?? '');
		setContent(initial.content ?? '');
		setTags((initial.tags ?? []).join(', '));
		// si tu modelo guarda careerId dentro de publication, úsalo:
		const cId = (initial as any)?.careerId ?? '';
		setCareer(typeof cId === 'string' ? cId : (cId?._id ?? ''));
	}, [initial]);

	/* preview del archivo */
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
		fd.append('tags', JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)));
		if (careerId) fd.append('careerId', careerId);

		try {
			setUploading(true);
			const result = await onSubmit(fd);

			if (mode === 'edit' && publicationId && onUpdated) {
				// el onSubmit del sidebar ya decide create/update; aquí solo notificamos
				onUpdated(result);
			} else {
				onCreated(result);
			}

			// reset SOLO si es creación; en edición cerramos desde el dialog padre
			if (mode === 'create') {
				setTitle('');
				setContent('');
				setTags('');
				setFile(null);
				setCareer('');
			}
		} catch (err) {
			console.error('Error al enviar publicación:', err);
		} finally {
			setUploading(false);
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

				{preview && file && (
					file.type.startsWith('image/') ? (
						<Avatar variant="rounded" src={preview} sx={{ width: 80, height: 80, mb: 1 }} />
					) : (
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
							<InsertDriveFileIcon color="action" />
							<Typography>{file.name}</Typography>
						</Box>
					)
				)}

				{uploading && (
					<Box sx={{ my: 1 }}>
						<LinearProgress />
						<Typography variant="caption">Espera un momento…</Typography>
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
				<FilledButton variant="ghost" colorType="secondary" type="reset" disabled={uploading}>
					Cancelar
				</FilledButton>
				<Button />
				<FilledButton
					variant="solid"
					colorType="primary"
					type="submit"
					disabled={uploading || !title || !content}
				>
					{mode === 'edit' ? (uploading ? 'Guardando…' : 'Guardar cambios') : (uploading ? 'Verificando…' : 'Publicar')}
				</FilledButton>
			</PublicationFormActions>
		</form>
	);
};

export default CreatePublicationForm;

