import React, { useEffect, useMemo, useState } from 'react';
import { listUnits, createUnit, updateUnit, deleteUnit } from '../../../async/services/unitService';
import { listSubjects } from '../../../async/services/subjectService';
import { fetchCareers } from '../../../async/services/careerService';
import {
	Container, Title, Button, Input, Select, Option,
	List, Item, ActionButton
} from '../careers/careerManagerStyles';

/** Nota:
 *  Permitimos unidades solo para materias “fundamentales”.
 *  Si el backend expone `subject.isFundamental`, filtramos aquí.
 *  Si no existe, mostramos todo pero con un aviso (no bloquea).
 */

type Career = { _id: string; name: string };
type Subject = { _id: string; name: string; code: string; isFundamental?: boolean };
type Unit = { _id: string; subjectId: string; title: string; week?: number };

const UnitManager: React.FC = () => {
	const [careers, setCareers] = useState<Career[]>([]);
	const [careerId, setCareerId] = useState<string>('');

	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [subjectId, setSubjectId] = useState<string>('');

	const [units, setUnits] = useState<Unit[]>([]);
	const [sel, setSel] = useState<Unit | null>(null);

	const [title, setTitle] = useState('');
	const [week, setWeek] = useState<number | ''>('');

	const loadCareers = async () => {
		const careers = await fetchCareers();   
		setCareers(careers || []);
	};

	const loadSubjects = async () => {
		const { subjects } = await listSubjects(careerId || undefined);
		setSubjects(subjects || []);
	};

	const loadUnits = async () => {
		if (!subjectId) { setUnits([]); return; }
		const { units } = await listUnits(subjectId);
		setUnits(units || []);
	};

	useEffect(() => { loadCareers(); }, []);
	useEffect(() => { setSubjectId(''); loadSubjects(); }, [careerId]);
	useEffect(() => { loadUnits(); }, [subjectId]);

	const fundamentalSubjects = useMemo(
		() => subjects.filter(s => typeof s.isFundamental === 'boolean' ? s.isFundamental : true), // si BE no envía flag, no filtramos
		[subjects]
	);

	const currentSubject = useMemo(() => subjects.find(s => s._id === subjectId), [subjects, subjectId]);
	const unitsEnabled = currentSubject ? (typeof currentSubject.isFundamental === 'boolean' ? currentSubject.isFundamental : true) : false;

	const clear = () => { setSel(null); setTitle(''); setWeek(''); };

	const save = async () => {
		if (!subjectId) { alert('Selecciona una materia'); return; }
		const payload: any = { subjectId, title, week: week === '' ? undefined : Number(week) };
		if (sel) await updateUnit(sel._id, { title: payload.title, week: payload.week });
		else     await createUnit(payload);
		clear(); loadUnits();
		alert(sel ? 'Unidad actualizada' : 'Unidad creada');
	};

	const edit = (u: Unit) => { setSel(u); setTitle(u.title); setWeek(u.week ?? ''); };
	const remove = async (id: string) => { if (!window.confirm('¿Eliminar unidad?')) return; await deleteUnit(id); loadUnits(); };

	return (
		<Container>
			<Title>Gestión de Unidades / Temas</Title>

			<Select value={careerId} onChange={e => setCareerId(e.target.value)}>
				<Option value="">Selecciona carrera</Option>
				{careers.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)}
			</Select>

			<Select value={subjectId} onChange={e => setSubjectId(e.target.value)} disabled={!careerId}>
				<Option value="">Selecciona materia</Option>
				{(fundamentalSubjects.length ? fundamentalSubjects : subjects).map(s => (
					<Option key={s._id} value={s._id}>
						{s.name}{typeof s.isFundamental === 'boolean' ? (s.isFundamental ? ' · Fundamental' : ' · No fundamental') : ''}
					</Option>
				))}
			</Select>

			{!unitsEnabled && subjectId && (
				<div style={{ fontSize: 12, margin: '8px 0', opacity: .8 }}>
					* Esta materia no está marcada como “fundamental”. Puedes ver unidades existentes, pero considera mantenerlas vacías.
				</div>
			)}

			<Input placeholder="Título de la unidad/tema" value={title} onChange={e => setTitle(e.target.value)} />
			<Input type="number" placeholder="Semana (opcional)" value={week} onChange={e => setWeek(e.target.value === '' ? '' : Number(e.target.value))} />

			<Button onClick={save} disabled={!subjectId || !title}>
				{sel ? 'Actualizar unidad' : 'Crear unidad'}
			</Button>

			<List>
				{units.map(u => (
					<Item key={u._id}>
						<div>
							<strong>{u.title}</strong>
							{typeof u.week !== 'undefined' && u.week !== null ? ` · Semana ${u.week}` : ''}
						</div>
						<div>
							<ActionButton onClick={() => edit(u)}>Editar</ActionButton>
							<ActionButton onClick={() => remove(u._id)}>Eliminar</ActionButton>
						</div>
					</Item>
				))}
			</List>
		</Container>
	);
};

export default UnitManager;

