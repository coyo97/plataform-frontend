import React, { useState } from 'react';
import FormTextField   from '../../../../shared/atoms/form/FormTextField';
import FormSelect      from '../../../../shared/atoms/form/FormSelect';
import FormFileInput   from '../../../../shared/atoms/form/FormFileInput';
import FormButton      from '../../../../shared/atoms/form/FormButton';

import { PublicationFormBody, PublicationFormActions } from '../../moleculas';

import type { Career, Publication } from '../../../../../async/services/publicationService';

interface Props {
	careers   : Career[];
	onSubmit  : (fd: FormData) => Promise<Publication>;
	onCreated : (p : Publication) => void;                // avisa al feed
}

const CreatePublicationForm: React.FC<Props> = ({ careers, onSubmit, onCreated }) => {
	/* estado local */
	const [title  , setTitle]   = useState('');
	const [content, setContent] = useState('');
	const [tags   , setTags]    = useState('');
	const [file   , setFile]    = useState<File|null>(null);
	const [careerId,setCareer]  = useState('');

	/* submit */
	const handle = async (e:React.FormEvent) => {
		e.preventDefault();
		const fd = new FormData();
		fd.append('title'  , title);
		fd.append('content', content);
		if (file)  fd.append('file', file);
		fd.append('tags', JSON.stringify(tags.split(',').map(t=>t.trim())));
		if (careerId) fd.append('careerId', careerId);

		const pub = await onSubmit(fd);   // ← devuelve la publicación creada
		onCreated(pub);                   // ← la página añade al feed
		/* reset */
		setTitle(''); setContent(''); setTags(''); setFile(null); setCareer('');
	};

	return (
		<form onSubmit={handle}>
			<PublicationFormBody>
				<FormTextField label="Título" value={title} onChange={e=>setTitle(e.target.value)} required/>
				<FormTextField label="Contenido" value={content} onChange={e=>setContent(e.target.value)}
					multiline rows={4} required/>
				<FormTextField label="Etiquetas" value={tags} onChange={e=>setTags(e.target.value)}/>

				<FormFileInput onChange={e=>e.target.files && setFile(e.target.files[0])}/>

				<FormSelect native value={careerId} onChange={e=>setCareer(e.target.value as string)}>
					<option value="">Selecciona carrera</option>
					{careers.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
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

