import React, { useEffect, useMemo, useState } from 'react';
import { listSubjects, createSubject, updateSubject, deleteSubject } from '../../../async/services/subjectService';
import { fetchMyCareers } from '../../../async/services/careerService';

import { Container, Button, Input, Select, Option, List, Item, ActionButton } from '../careers/careerManagerStyles';

import Text from '../../shared/atoms/typography/Text';

type Career = { _id: string; name: string };
type Subject = {
	_id: string;
	name: string;
	code: string;
	careerIds: string[];
	level?: number;
	credits?: number;
	isFundamental?: boolean;
};

const SubjectManager: React.FC = () => {
	const [careers, setCareers] = useState<Career[]>([]);
	const [filterCareer, setFilterCareer] = useState<string>('');

	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [sel, setSel] = useState<Subject | null>(null);

	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [careerIds, setCareerIds] = useState<string[]>([]);
	const [level, setLevel] = useState<number | ''>('');
	const [credits, setCredits] = useState<number | ''>('');
	const [isFundamental, setIsFundamental] = useState<boolean>(false);

	const loadCareers = async () => {
		const data = await fetchMyCareers();
		setCareers(data || []);

		if (data && data.length === 1) {
			setFilterCareer(data[0]._id);
			setCareerIds([data[0]._id]);
		}
	};

	const loadSubjects = async () => {
		const { subjects } = await listSubjects(filterCareer || undefined);
		setSubjects(subjects || []);
	};

	useEffect(() => { loadCareers(); }, []);
	useEffect(() => { loadSubjects(); }, [filterCareer]);

	const clear = () => {
		setSel(null);
		setName('');
		setCode('');
		setCareerIds(careers.length === 1 ? [careers[0]._id] : []); 
		setLevel('');
		setCredits('');
		setIsFundamental(false);
	};

	const save = async () => {
		const payload: any = {
			name, code, careerIds,
			level: level === '' ? undefined : Number(level),
			credits: credits === '' ? undefined : Number(credits),
			isFundamental
		};

		if (sel) await updateSubject(sel._id, payload);
		else     await createSubject(payload);

		clear();
		loadSubjects();
		alert(sel ? 'Materia actualizada' : 'Materia creada');
	};

	const edit = (s: Subject) => {
		setSel(s);
		setName(s.name);
		setCode(s.code);
		setCareerIds(s.careerIds || []);
		setLevel(s.level ?? '');
		setCredits(s.credits ?? '');
		setIsFundamental(!!s.isFundamental);
	};

	const remove = async (id: string) => {
		if (!window.confirm('¿Eliminar materia?')) return;
		await deleteSubject(id);
		loadSubjects();
	};

	const careersMap = useMemo(
		() => new Map(careers.map(c => [c._id, c.name])),
		[careers]
	);

	return (
		<Container>
			<Text align='center' headingLevel='h3'>Gestión de Materias</Text>

			{careers.length > 1 && (
				<Select
					value={filterCareer}
					onChange={e => setFilterCareer(e.target.value)}
				>
					<Option value="">Todas las carreras</Option>
					{careers.map(c => (
						<Option key={c._id} value={c._id}>{c.name}</Option>
					))}
				</Select>
			)}

			<Input placeholder="Nombre de la materia" value={name} onChange={e => setName(e.target.value)} />
			<Input placeholder="Código (p.ej. MAT-101)" value={code} onChange={e => setCode(e.target.value)} />

			{careers.length > 1 && (
				<Select
					multiple
					value={careerIds}
					onChange={e => {
						const values = Array.from((e.target as HTMLSelectElement).selectedOptions).map(o => o.value);
						setCareerIds(values);
					}}
				>
					{careers.map(c => (
						<Option key={c._id} value={c._id}>{c.name}</Option>
					))}
				</Select>
			)}

			{/* Si solo tiene 1 → ya está seteado desde loadCareers() */}

			<Input
				type="number"
				placeholder="Nivel/semestre (opcional)"
				value={level}
				onChange={e => setLevel(e.target.value === '' ? '' : Number(e.target.value))}
			/>
			<Input
				type="number"
				placeholder="Créditos (opcional)"
				value={credits}
				onChange={e => setCredits(e.target.value === '' ? '' : Number(e.target.value))}
			/>

			<label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
				<input
					type="checkbox"
					checked={isFundamental}
					onChange={e => setIsFundamental(e.target.checked)}
				/>
				Solo para materias fundamentales (habilita Unidades)
			</label>

			<Button onClick={save}>
				{sel ? 'Actualizar materia' : 'Crear materia'}
			</Button>

			<List>
				{subjects.map(s => (
					<Item key={s._id}>
						<div>
							<strong>{s.name}</strong> — {s.code}
							<div style={{ fontSize: 12, opacity: 0.8 }}>
								Carreras:
								{(s.careerIds || [])
									.map(id => careersMap.get(id))
									.filter(Boolean)
									.join(', ') || '—'}
								{typeof s.isFundamental !== 'undefined' && (
									<> · {s.isFundamental ? 'Fundamental' : 'No fundamental'}</>
								)}
							</div>
						</div>
						<div>
							<ActionButton onClick={() => edit(s)}>Editar</ActionButton>
							<ActionButton onClick={() => remove(s._id)}>Eliminar</ActionButton>
						</div>
					</Item>
				))}
			</List>
		</Container>
	);
};

export default SubjectManager;

