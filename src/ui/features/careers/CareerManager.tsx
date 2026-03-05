import React, { useEffect, useState } from 'react';
import {
	fetchCareers, fetchFaculties,
	createCareer, updateCareer, deleteCareer
} from '../../../async/services/careerService';

import {
	Container, Title, Input, Textarea, Button,
	CareerList, CareerItem, CareerName, ActionButton
} from './careerManagerStyles';

import FormSelect from '../../shared/atoms/form/FormSelect';
import Loader     from '../../shared/atoms/feedback/loader/Loader';
import Text from '../../shared/atoms/typography/Text';

interface Faculty { _id:string; name:string }
interface Career  { _id:string; name:string; description?:string; facultyId?:string; mode?:'semester'|'trimester'|'year'; }

const CareerManager:React.FC = () => {
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [careers,   setCareers]   = useState<Career[]>([]);
	const [selected,    setSelected]    = useState<Career|null>(null);
	const [name,        setName]        = useState('');
	const [description, setDescription] = useState('');
	const [facultyId,   setFacultyId]   = useState('');

	const [mode,setMode]         =useState<'semester'|'trimester'|'year'>('year');

	const [loading, setLoading] = useState(true);

	const loadAll = async () => {
		setLoading(true);
		const [fac, car] = await Promise.all([
			fetchFaculties(), fetchCareers()
		]);
		setFaculties(fac);  setCareers(car);  setLoading(false);
	};
	useEffect(()=>{ loadAll(); },[]);

	const clearForm = ()=>{ setSelected(null); setName(''); setDescription(''); setFacultyId(''); };

	const handleSave = async () => {
		const payload = { name, description, facultyId: facultyId||undefined, mode };
		if (selected) await updateCareer(selected._id, payload);
		else          await createCareer(payload);
		clearForm(); loadAll();
		alert(selected ? 'Carrera actualizada' : 'Carrera creada');
	};

	const handleEdit = (c:Career)=> {
		setSelected(c);
		setName(c.name); setDescription(c.description||''); setFacultyId(c.facultyId||'');
	};

	const handleDelete = async(id:string)=>{
		await deleteCareer(id); loadAll(); alert('Carrera eliminada');
	};

	if(loading) return <Loader/>;

	return(
		<Container>
			<Text align='center' headingLevel='h3'>Gestión de Carreras</Text>

			<FormSelect
				label="Facultad (opcional)"
				value={facultyId}
				onChange={(value) => setFacultyId(value)}
				options={[
					{ value: '', label: '— Ninguna —' },
					...faculties.map(f => ({ value: f._id, label: f.name })),
				]}
			/>

			<Input
				placeholder="Nombre de la carrera"
				value={name}
				onChange={e=>setName(e.target.value)}
			/>
			<Textarea
				placeholder="Descripción"
				value={description}
				onChange={e=>setDescription(e.target.value)}
			/>

			<FormSelect
				label="Modo académico (opcional)"
				value={mode}
				onChange={v=>setMode(v as any)}
				options={[
					{value:'year', label:'Anual'},
					{value:'semester', label:'Semestral'},
					{value:'trimester', label:'Trimestral'},
				]}
			/>

			<Button onClick={handleSave}>
				{selected ? 'Actualizar carrera' : 'Crear carrera'}
			</Button>

			{/* listado */}
			<CareerList>
				{careers.map(c => (
					<CareerItem key={c._id}>
						<CareerName>{c.name}</CareerName>

						{/* descripción ‒ visible solo si existe */}
						{c.description && (
							<p style={{ margin:'4px 0', fontSize:'0.85rem', color:'#555' }}>
								{c.description}
							</p>
						)}

						{/* facultad */}
						{c.facultyId && (
							<p style={{ margin:0, fontSize:'0.8rem', color:'#777' }}>
								Facultad: {(typeof c.facultyId === 'string')
									? faculties.find(f=>f._id===c.facultyId)?.name
									: (c.facultyId as any).name}
							</p>
						)}

						<div>
							<ActionButton onClick={()=>handleEdit(c)}>Editar</ActionButton>
							<ActionButton onClick={()=>handleDelete(c._id)}>Eliminar</ActionButton>
						</div>
					</CareerItem>
				))}
			</CareerList>
		</Container>
	);
};

export default CareerManager;

