// ui/features/academicHelp/organisms/HelpFilterSidebar.tsx
import React, { useEffect, useState } from 'react';
import Sidebar       from '../../../shared/organisms/sidebar/Sidebar';
import SearchSelect  from '../../../shared/atoms/select/SearchSelect';
import MainInput     from '../../../shared/atoms/inputs/MainInput';
import FilledButton  from '../../../shared/atoms/buttons/filledButton/FilledButton';
import SmartBox      from '../../../shared/atoms/box/SmartBox';

import {
	fetchFaculties, fetchCareers,
	fetchSubjects,  fetchCycles
} from '../../../../async/services/catalogService';

import { HelpFilters } from '../hook/useHelpFeed';

/* ---------- Props ---------- */
interface Props {
	open    : boolean;
	onClose : () => void;
	current : HelpFilters;               // SIEMPRE objeto (ya llega con {} en el parent)
	onApply : (f: HelpFilters) => void;
	onClear : () => void;
}

/* ---------- Helper ---------- */
const map = (arr: any[], lbl = 'name') =>
	arr.map(i => ({ value: i._id, label: i[lbl] }));

/* ---------- Componente ---------- */
const HelpFilterSidebar: React.FC<Props> = ({
	open, onClose, current, onApply, onClear,
}) => {
	/* estado local = copia de los filtros actuales */
	const [local, setLocal] = useState<HelpFilters>({});

	/* catálogos */
	const [fac, setFac] = useState<any[]>([]);
	const [car, setCar] = useState<any[]>([]);
	const [sub, setSub] = useState<any[]>([]);
	const [cyc, setCyc] = useState<any[]>([]);

	/* carga fija */
	useEffect(() => {
		fetchFaculties().then(r => setFac(r.faculties));
		fetchCycles   ().then(r => setCyc(r.cycles));
	}, []);

	/* cascada: carreras ← facultad */
	useEffect(() => {
		if (!local?.facultyId) { setCar([]); setSub([]); return; }
		fetchCareers(local.facultyId).then(r => setCar(r.careers));
	}, [local?.facultyId]);

	/* cascada: asignaturas ← carrera */
	useEffect(() => {
		if (!local?.careerId) { setSub([]); return; }
		fetchSubjects(local.careerId).then(r => setSub(r.subjects));
	}, [local?.careerId]);

	return (
		<Sidebar open={open} onClose={onClose} width={180} sticky variant="flat">
			<SmartBox column gap="px12" p="px8">
				{/* FACULTAD */}
				<SearchSelect
					label="Facultad"
					value={local.facultyId ?? ''}
					options={[{ value:'', label:'Todas' }, ...map(fac)]}
					onChange={v => setLocal({
						...local,
						facultyId : v || undefined,
						careerId  : undefined,
						subjectId : undefined,
					})}
				/>

				{/* CARRERA */}
				<SearchSelect
					label="Carrera"
					disabled={!local.facultyId}
					value={local.careerId ?? ''}
					options={[{ value:'', label:'Todas' }, ...map(car)]}
					onChange={v => setLocal({
						...local,
						careerId  : v || undefined,
						subjectId : undefined,
					})}
				/>

				{/* ASIGNATURA */}
				<SearchSelect
					label="Asignatura"
					disabled={!local.careerId}
					value={local.subjectId ?? ''}
					options={[{ value:'', label:'Todas' }, ...map(sub)]}
					onChange={v => setLocal({ ...local, subjectId: v || undefined })}
				/>

				{/* CICLO */}
				<SearchSelect
					label="Ciclo académico"
					value={local.cycleId ?? ''}
					options={[
						{ value:'', label:'Todos' },
						...cyc.map(c => ({
							value : c._id,
							label : c.type === 'year'
								? `${c.year} • Anual`
								: `${c.year} • ${c.type === 'semester' ? 'S' : 'T'}${c.number}`,
						})),
					]}
					onChange={v => setLocal({ ...local, cycleId: v || undefined })}
				/>

				{/* TIPO DE SOLICITUD */}
				<SearchSelect
					label="Tipo solicitud"
					value={local.requestType ?? ''}
					options={[
						{ value:'', label:'Todas' },
						{ value:'concept_question', label:'Pregunta' },
						{ value:'need_notes',       label:'Apuntes'  },
						{ value:'need_exam',        label:'Examen'   },
						{ value:'need_assignment',  label:'Tarea'    },
					]}
					onChange={v =>
						setLocal({ ...local,
								 requestType: (v || undefined) as HelpFilters['requestType']
					})
					}

				/>

				{/* ESTADO */}
				<SearchSelect
					label="Estado"
					value={local.status ?? ''}
					options={[
						{ value:'',        label:'Todos'    },
						{ value:'open',    label:'Abiertos' },
						{ value:'resolved',label:'Resueltos'},
					]}
					onChange={v =>
						setLocal({ ...local,
								 status: (v as HelpFilters['status']) || undefined
					})
					}

				/>

				{/* AUTOR */}
				<MainInput
					label="Autor"
					value={local.author ?? ''}
					placeholder="Nombre de usuario"
					onChange={v => setLocal({ ...local, author: v || undefined })}
				/>

				{/* BOTONES */}
				<FilledButton fullWidth colorType="primary" onClick={() => onApply(local)}>
					Aplicar filtros
				</FilledButton>
				<FilledButton
					fullWidth colorType="secondary" variant="outlined"
					onClick={() => { setLocal({}); onClear(); }}
				>
					Limpiar
				</FilledButton>
			</SmartBox>
		</Sidebar>
	);
};

export default HelpFilterSidebar;

