// src/ui/features/publications/organisms/createPublicationForm/CreatePublicationForm.tsx
import React, { useState, useEffect } from 'react';
import MainInput from '../../../../shared/atoms/inputs/MainInput';
import TextEditor from '../../../../shared/atoms/inputs/TextEditor'; 
import CareerSelector from '../../../../shared/molecules/selector/CareerSelector';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';
import FileButton from '../../../../shared/atoms/buttons/fileButton/FileButton';
import PublicationFormBody from '../../../../shared/atoms/form/PublicationFormBody';
import PublicationFormActions from '../../../../shared/atoms/form/PublicationFormActions';
import { Box, Typography, LinearProgress, Button, Avatar } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import type { Career, Publication } from '../../../../../types/publication';

import {
	validatePublicationTitle,
	validatePublicationBody,
	validatePublicationTags,
} from '../../../../shared/utils/validation/validators';

import ModerationAlert from '../../../../shared/molecules/moderation/ModerationAlert';
import { resolveErrorMessage } from '../../../../shared/utils/validation/moderationError';

interface Props {
	careers  : Career[];
	onSubmit : (fd: FormData) => Promise<Publication>;
	onCreated: (p: Publication) => void;

	mode?: 'create' | 'edit';
	publicationId?: string;
	initial?: Partial<Publication>;
	onUpdated?: (p: Publication) => void;
}

interface PublicationFormErrors {
	title?: string;
	content?: string;
	tags?: string;
	careerId?: string;
}

const CreatePublicationForm: React.FC<Props> = ({
	careers,
	onSubmit,
	onCreated,
	mode = 'create',
	publicationId,
	initial,
	onUpdated,
}) => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');  
	const [tags, setTags] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [careerId, setCareer] = useState('');

	const [preview, setPreview] = useState<string>('');
	const [uploading, setUploading] = useState(false);

	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<PublicationFormErrors>({});

	useEffect(() => {
		if (!initial) return;
		setTitle(initial.title ?? '');
		setContent(initial.content ?? '');
		setTags((initial.tags ?? []).join(', '));
		const cId = (initial as any)?.careerId ?? '';
		setCareer(typeof cId === 'string' ? cId : (cId?._id ?? ''));
	}, [initial]);

	useEffect(() => {
		if (!file) {
			setPreview('');
			return;
		}
		const url = URL.createObjectURL(file);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	// Handlers que limpian error al escribir
	const handleTitleChange = (value: string) => {
		setTitle(value);
		setFieldErrors((prev) => ({ ...prev, title: undefined }));
	};

	const handleContentChange = (value: string) => {
		setContent(value); 
		setFieldErrors((prev) => ({ ...prev, content: undefined }));
	};

	const handleTagsChange = (value: string) => {
		setTags(value);
		setFieldErrors((prev) => ({ ...prev, tags: undefined }));
	};

	const handleCareerChange = (value: string) => {
		setCareer(value);
		setFieldErrors((prev) => ({ ...prev, careerId: undefined }));
	};

	const handle = async (e: React.FormEvent) => {
		e.preventDefault();
		if (uploading) return;

		setErrorMsg(null);

		const errors: PublicationFormErrors = {
			title: validatePublicationTitle(title),
			content: validatePublicationBody(content), 
			tags: validatePublicationTags(tags),
		};

		const hasErrors = Object.values(errors).some((err) => !!err);

		if (hasErrors) {
			setFieldErrors(errors);
			return;
		}

		const fd = new FormData();
		fd.append('title', title);
		fd.append('content', content); 
		if (file) fd.append('file', file);
		fd.append(
			'tags',
			JSON.stringify(
				tags
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean)
			)
		);
		if (careerId) fd.append('careerId', careerId);

		try {
			setUploading(true);
			const result = await onSubmit(fd);

			if (mode === 'edit' && publicationId && onUpdated) {
				onUpdated(result);
			} else {
				onCreated(result);
			}

			if (mode === 'create') {
				setTitle('');
				setContent('');
				setTags('');
				setFile(null);
				setCareer('');
				setFieldErrors({});
			}
		} catch (err: any) {
			console.error('Error al enviar publicación:', err);

			const userMsg = resolveErrorMessage(err, {
				generic   : 'No se pudo publicar el material. Inténtalo nuevamente.',
				moderation: 'El contenido fue bloqueado por moderación. Revisa que el título, el texto y el archivo (imagen/video) cumplan las políticas.',
				fileType  : 'Tipo de archivo no permitido para publicaciones. Revisa las extensiones soportadas.',
				fileSize  : 'El archivo que intentas subir es demasiado grande para las publicaciones.',
			});

			setErrorMsg(userMsg);
		} finally {
			setUploading(false);
		}
	};

	return (
		<form onSubmit={handle}>
			<ModerationAlert
				message={errorMsg}
				onClose={() => setErrorMsg(null)}
			/>

			<PublicationFormBody>
				<MainInput
					label="Título"
					value={title}
					onChange={handleTitleChange}
					placeholder="Ej: Apuntes de cálculo diferencial"
					error={fieldErrors.title}
				/>

				<TextEditor
					label="Contenido"
					value={content}
					onChange={handleContentChange}
					placeholder="Describe brevemente el contenido del material…"
					hint="Puedes usar negritas, cursivas y listas para estructurar mejor el contenido."
					minHeight={180}
					toolbarOptions={{
						bold: true,
						italic: true,
						underline: true,
						bulletList: true,
						orderedList: true,
					}}
					error={fieldErrors.content}
				/>

				<MainInput
					label="Etiquetas"
					value={tags}
					onChange={handleTagsChange}
					placeholder="Ej: física, integración, ejercicios"
					hint="Separar por comas (1 a 5 etiquetas)"
					error={fieldErrors.tags}
				/>

				<FileButton
					onChange={(e) => e.target.files && setFile(e.target.files[0])}
				/>

				{preview && file && (
					file.type.startsWith('image/') ? (
						<Avatar
							variant="rounded"
							src={preview}
							sx={{ width: 80, height: 80, mb: 1 }}
						/>
					) : (
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								mb: 1,
							}}
						>
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
					onChange={handleCareerChange}
				/>
			</PublicationFormBody>

			<PublicationFormActions>
				<Button />
				<FilledButton
					variant="solid"
					colorType="primary"
					type="submit"
					disabled={uploading}
				>
					{mode === 'edit'
						? uploading
							? 'Guardando…'
							: 'Guardar cambios'
							: uploading
								? 'Verificando…'
								: 'Publicar'}
				</FilledButton>
			</PublicationFormActions>
		</form>
	);
};

export default CreatePublicationForm;

