import React, { useState } from 'react';
import MainInput from '../../../../shared/atoms/inputs/MainInput'; // ✅ Import nuevo
import FormSelect    from '../../../../shared/atoms/form/FormSelect';
import FormFileInput from '../../../../shared/atoms/form/FormFileInput';
import FormButton    from '../../../../shared/atoms/form/FormButton';
import { PublicationFormBody, PublicationFormActions } from '../../moleculas';

import type { Career, Publication } from '../../../../../types/publication';

interface Props {
	careers   : Career[];
	onSubmit  : (fd: FormData) => Promise<Publication>;
	onCreated : (p : Publication) => void;
}

const CreatePublicationForm: React.FC<Props> = ({ careers, onSubmit, onCreated }) => {
	const [title, setTitle]     = useState('');
	const [content, setContent] = useState('');
	const [tags, setTags]       = useState('');
	const [file, setFile]       = useState<File|null>(null);
	const [careerId, setCareer] = useState('');

	const handle = async (e:React.FormEvent) => {
		e.preventDefault();
		const fd = new FormData();
		fd.append('title', title);
		fd.append('content', content);
		if (file) fd.append('file', file);
		fd.append('tags', JSON.stringify(tags.split(',').map(t => t.trim())));
		if (careerId) fd.append('careerId', careerId);

		const pub = await onSubmit(fd);
		onCreated(pub);

		// reset
		setTitle('');
		setContent('');
		setTags('');
		setFile(null);
		setCareer('');
	};

	return (
		<form onSubmit={handle}>
			<PublicationFormBody>
				<MainInput
					label="Título"
					value={title}
					onChange={(val) => setTitle(val)}
					placeholder="Ej: Apuntes de cálculo diferencial"
					error={title.length === 0 ? 'El título es requerido' : undefined}
				/>

				<MainInput
					label="Contenido"
					value={content}
					onChange={(val) => setContent(val)}
					placeholder="Describe brevemente el contenido del material…"
					multiline
					rows={4}
					error={content.length === 0 ? 'El contenido no puede estar vacío' : undefined}
				/>

				<MainInput
					label="Etiquetas"
					value={tags}
					onChange={(val) => setTags(val)}
					placeholder="Ej: física, integración, ejercicios"
					hint="Separar por comas"
				/>

				<FormFileInput onChange={e => e.target.files && setFile(e.target.files[0])} />

				<FormSelect native value={careerId} onChange={e => setCareer(e.target.value as string)}>
					<option value="">Selecciona carrera</option>
					{careers.map(c => (
						<option key={c._id} value={c._id}>{c.name}</option>
					))}
				</FormSelect>
			</PublicationFormBody>

			<PublicationFormActions>
				<FormButton variant="outlined">Cancelar</FormButton>
				<FormButton variant="contained" color="secondary" type="submit">Publicar</FormButton>
			</PublicationFormActions>
		</form>
	);
};

export default CreatePublicationForm;

