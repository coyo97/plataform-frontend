// src/ui/components/publications/user/UserMaterials.tsx
import React, { useEffect, useState } from 'react';
import {
	fetchMyPublications, updatePublication, deletePublication,
	Publication,
} from '../../../../async/services/publicationService';

import getEnvVariables from '../../../../config/configEnvs';
import {
	Container, PublicationCard, PublicationTitle, PublicationContent,
	Tags, EditButton, DeleteButton,
	EditForm, Input, TextArea, FileInput,
	UpdateButton, CancelButton,
} from './userMaterialsStyles';

const ViewUserPublications: React.FC = () => {
	const [pubs, setPubs]           = useState<Publication[]>([]);
	const [sel , setSel]            = useState<Publication | null>(null);
	const [title, setTitle]         = useState('');
	const [content, setContent]     = useState('');
	const [tags, setTags]           = useState('');
	const [file, setFile]           = useState<File | null>(null);

	const { HOST } = getEnvVariables();

	//* cargar publicaciones 
	const load = async () => {
		const data = await fetchMyPublications();
		setPubs(data);
	};
	useEffect(() => { load(); }, []);

	//* editar / actualizar 
	const edit = (p: Publication) => {
		setSel(p);
		setTitle(p.title);
		setContent(p.content);
		setTags((p.tags??[]).join(', '));
	};

	const save = async () => {
		if (!sel) return;
		const fd = new FormData();
		fd.append('title', title);
		fd.append('content', content);
		fd.append('tags', JSON.stringify(tags.split(',').map(t=>t.trim())));
		if (file) fd.append('file', file);

		await updatePublication(sel._id, fd);
		alert('Publicación actualizada');
		await load();
		setSel(null);
	};

	const remove = async (id: string) => {
		await deletePublication(id);
		alert('Publicación eliminada');
		setPubs(pubs.filter(p => p._id !== id));
	};

	//* helper archivo 
	const renderFile = (p: Publication) => {
		if (!p.filePath || !p.fileType) return null;
		const url = `${HOST}/${p.filePath}`;

		if (p.fileType.startsWith('image/'))
			return <img src={url} alt={p.title} style={{ width: 300 }} />;

		if (p.fileType.startsWith('video/'))
			return (
				<video controls style={{ width: 300 }}>
					<source src={url} type={p.fileType} />
				</video>
			);

			if (p.fileType === 'application/pdf')
				return <a href={url} target="_blank" rel="noreferrer">Ver PDF</a>;

			return <a href={url} download>Descargar archivo</a>;
	};

	return (
		<Container>
			<h1>Mis Publicaciones</h1>

			{pubs.map(p => (
				<PublicationCard key={p._id}>
					<PublicationTitle>{p.title}</PublicationTitle>
					<PublicationContent>{p.content}</PublicationContent>
					<Tags><strong>Etiquetas:</strong> {(p.tags??[]).join(', ')}</Tags>
					{renderFile(p)}
					<EditButton   onClick={() => edit(p)}>Editar</EditButton>
					<DeleteButton onClick={() => remove(p._id)}>Eliminar</DeleteButton>
				</PublicationCard>
			))}

			{sel && (
				<EditForm>
					<h2>Editar Publicación</h2>
					<Input     value={title}   onChange={e=>setTitle(e.target.value)} placeholder="Título" />
					<TextArea  value={content} onChange={e=>setContent(e.target.value)} placeholder="Contenido" />
					<Input     value={tags}    onChange={e=>setTags(e.target.value)}  placeholder="Etiquetas (comas)" />
					<FileInput type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />

					<UpdateButton onClick={save}>Actualizar</UpdateButton>
					<CancelButton onClick={()=>setSel(null)}>Cancelar</CancelButton>
				</EditForm>
			)}
		</Container>
	);
};

export default ViewUserPublications;

