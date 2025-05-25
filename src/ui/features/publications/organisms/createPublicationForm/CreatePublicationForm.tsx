import React, { useState } from 'react';
import MainInput from '../../../../shared/atoms/inputs/MainInput'; //
import FormSelect    from '../../../../shared/atoms/form/FormSelect';
import FormFileInput from '../../../../shared/atoms/form/FormFileInput';
import FormButton    from '../../../../shared/atoms/form/FormButton';
import CareerSelector from '../../../../shared/molecules/selector/CareerSelector';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';
import FileButton from '../../../../shared/atoms/buttons/fileButton/FileButton';
import PublicationFormBody from '../../../../shared/atoms/form/PublicationFormBody';
import PublicationFormActions from '../../../../shared/atoms/form/PublicationFormActions';
import { useModerationAlert } from '../../../../shared/hooks/useModerationAlert';

import type { Career, Publication } from '../../../../../types/publication';
import {Button} from '@mui/material';

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
	const showModerationAlert = useModerationAlert();

	const handle = async (e: React.FormEvent) => {
		e.preventDefault();
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
			const pub = await onSubmit(fd);      
			onCreated(pub);                        // notifica al padre

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
				<FilledButton variant="solid" colorType="primary" type="submit">
					Publicar
				</FilledButton>
			</PublicationFormActions>
		</form>
	);
};

export default CreatePublicationForm;
