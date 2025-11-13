// ui/features/cycles/CycleManager.tsx
import React,{useEffect,useState} from 'react';
import { listCycles, createCycle, updateCycle, deleteCycle }
from '../../../async/services/cycleService';
import {
	Container, Title, Button, Input, Select, Option,
	List, Item, ActionButton
} from './careerManagerStyles';
import Text from '../../shared/atoms/typography/Text';

interface Cycle { _id:string; type:'semester'|'trimester'|'year'; year:number; number?:number }

const CycleManager:React.FC=()=>{
	const [cycles,setCycles]=useState<Cycle[]>([]);
	const [sel,setSel]=useState<Cycle|null>(null);
	const [type,setType]=useState<'semester'|'trimester'|'year'>('year');
	const [year,setYear]=useState<number>(new Date().getFullYear());
	const [num ,setNum ]=useState<number>(1);

	const load = async () => {
		const { cycles } = await listCycles();
		setCycles(cycles);
	};

	useEffect(() => {
		load();
	}, []);

	const clear=()=>{ setSel(null); setType('year'); setYear(new Date().getFullYear()); setNum(1); };

	const save=async()=>{
		const payload={type,year,number:type==='year'?undefined:num};
		sel? await updateCycle(sel._id,payload)
			: await createCycle(payload);
			clear(); load();
	};

	const edit =(c:Cycle)=>{ setSel(c); setType(c.type); setYear(c.year); setNum(c.number||1); };
	const remove=async(id:string)=>{ await deleteCycle(id); load(); };

	return(
		<Container>
			<Text align='center' headingLevel='h3'>Ciclos académicos</Text>

			<Select value={type} onChange={e=>setType(e.target.value as any)}>
				<Option value="year">Anual</Option>
				<Option value="semester">Semestre</Option>
				<Option value="trimester">Trimestre</Option>
			</Select>

			<Input type="number" value={year} onChange={e=>setYear(+e.target.value)} placeholder="Año"/>

			{type!=='year'&&(
				<Input type="number" value={num}  onChange={e=>setNum(+e.target.value)} placeholder="Nº"/>
			)}

			<Button onClick={save}>{sel?'Actualizar':'Crear'} ciclo</Button>

			<List>
				{cycles.map(c=>(
					<Item key={c._id}>
						{c.type==='year'
							? `${c.year} · Anual`
							: `${c.year} · ${c.type==='semester'?'S':'T'}${c.number}`
						}
						<div>
							<ActionButton onClick={()=>edit(c)}>Editar</ActionButton>
							<ActionButton onClick={()=>remove(c._id)}>Eliminar</ActionButton>
						</div>
					</Item>
				))}
			</List>
		</Container>
	);
};

export default CycleManager;

