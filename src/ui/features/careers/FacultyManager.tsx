import React, { useEffect, useState } from 'react';
import {
	fetchFaculties, createFaculty,
	updateFaculty, deleteFaculty
} from '../../../async/services/careerService';

import {
	Container, Title, Input, Textarea, Button,
	CareerList as FacultyList,
	CareerItem as FacultyItem,
	CareerName as FacultyName,
	ActionButton
} from './careerManagerStyles';      // reutilizamos estilos

import Loader from '../../shared/atoms/feedback/loader/Loader';

interface Faculty { _id:string; name:string; dean?:string; icon?:string }

const FacultyManager:React.FC = () => {

	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [selected,  setSelected]  = useState<Faculty|null>(null);
	const [name, setName]           = useState('');
	const [dean, setDean]           = useState('');
	const [icon, setIcon]           = useState('');
	const [loading, setLoading]     = useState(true);

	/* -------- load ---------- */
	const load = async ()=>{
		setLoading(true);
		setFaculties(await fetchFaculties());
		setLoading(false);
	};
	useEffect(()=>{ load(); },[]);

	/* -------- helpers -------- */
	const clear = ()=>{ setSelected(null); setName(''); setDean(''); setIcon(''); };

	const handleSave = async ()=>{
		const payload = { name, dean:dean||undefined, icon:icon||undefined };
		if(selected) await updateFaculty(selected._id, payload);
		else         await createFaculty(payload);
		clear(); await load();
		alert(selected ? 'Facultad actualizada' : 'Facultad creada');
	};

	const handleEdit = (f:Faculty)=>{
		setSelected(f); setName(f.name); setDean(f.dean||''); setIcon(f.icon||'');
	};

	const handleDelete = async(id:string)=>{
		if(!window.confirm('¿Eliminar facultad?')) return;
		await deleteFaculty(id); await load();
	};

	/* -------- UI ---------- */
	if(loading)return <Loader/>;

	return(
		<Container>
			<Title>Gestión de Facultades</Title>

			<Input
				placeholder="Nombre de la facultad"
				value={name} onChange={e=>setName(e.target.value)}
			/>
			<Input
				placeholder="Decano (opcional)"
				value={dean} onChange={e=>setDean(e.target.value)}
			/>
			<Input
				placeholder="URL/Icono (opcional)"
				value={icon} onChange={e=>setIcon(e.target.value)}
			/>

			<Button onClick={handleSave}>
				{selected ? 'Actualizar facultad' : 'Crear facultad'}
			</Button>

			<FacultyList>
				{faculties.map(f=>(
					<FacultyItem key={f._id}>
						<FacultyName>{f.name}</FacultyName>
						<div>
							<ActionButton onClick={()=>handleEdit(f)}>Editar</ActionButton>
							<ActionButton onClick={()=>handleDelete(f._id)}>Eliminar</ActionButton>
						</div>
					</FacultyItem>
				))}
			</FacultyList>
		</Container>
	);
};

export default FacultyManager;

