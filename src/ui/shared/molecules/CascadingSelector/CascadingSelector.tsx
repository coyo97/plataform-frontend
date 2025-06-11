/// ui/shared/molecules/selector/CascadingSelector/CascadingSelector.tsx
import React, { useEffect, useState } from 'react';
import SearchSelect, { SelectOption } from '../../atoms/select/SearchSelect';
import {
	fetchFaculties, fetchCareers, fetchSubjects, fetchCycles, fetchUnits
} from '../../../../async/services/catalogService';
import { Faculty, Career, Subject, Cycle, Unit } from '../../../../types/catalog'; // ← según tu carpeta types
import SmartBox from '../../atoms/box/SmartBox';

/* ----------------------- Tipos de props ----------------------- */
export interface CascadeValue {
	facultyId ?: string;
	careerId  ?: string;
	subjectId ?: string;
	unitId    ?: string;
	cycleId   ?: string;
}

interface Props {
	value    : CascadeValue;
	onChange : (v:CascadeValue)=>void;
}

const CascadingSelector:React.FC<Props>=({ value, onChange })=>{
	/* catálogos en memoria */
	const [faculties,setFaculties] = useState<Faculty[]>([]);
	const [careers  ,setCareers  ] = useState<Career[]>([]);
	const [subjects ,setSubjects ] = useState<Subject[]>([]);
	const [units    ,setUnits    ] = useState<Unit[]>([]);
	const [cycles   ,setCycles   ] = useState<Cycle[]>([]);

	useEffect(()=>{
		fetchFaculties().then(r=>setFaculties(r.faculties));
		fetchCycles   ().then(r=>setCycles   (r.cycles));
	},[]);

	useEffect(()=>{
		if (value.facultyId){
			fetchCareers(value.facultyId).then(r=>setCareers(r.careers));
		} else { setCareers([]); }
		// reset niveles inferiores
		onChange({ ...value, careerId:'', subjectId:'', unitId:'' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[value.facultyId]);

	useEffect(()=>{
		if (value.careerId){
			fetchSubjects(value.careerId).then(r=>setSubjects(r.subjects));
		} else { setSubjects([]); }
		onChange({ ...value, subjectId:'', unitId:'' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[value.careerId]);

	useEffect(()=>{
		if (value.subjectId){
			fetchUnits(value.subjectId).then(r=>setUnits(r.units));
		} else { setUnits([]); }
		onChange({ ...value, unitId:'' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[value.subjectId]);

	/* helper para mapear a opciones */
	const map = <T extends { _id:string; name?:string; title?:string }>(arr:T[]):SelectOption[] =>
		arr.map(o=>({ value:o._id, label:o.name ?? o.title ?? '--' }));

	const cycleLabel = (c:Cycle)=>(
		c.type==='year'
			? `${c.year} • Anual`
			: c.type==='semester'
				? `${c.year} • Semestre ${c.number}`
				: `${c.year} • Trimestre ${c.number}`
	);

	/* ---------------- render ---------------- */
	return(
		<>
			<SmartBox row gap="px16" sx={{ flexWrap:'wrap' }}>
				<SmartBox column gap="px10" p='px6' >
					<SearchSelect
						label="Facultad"
						options={map(faculties)}
						value={value.facultyId}
						onChange={facultyId => onChange({ ...value, facultyId })}
						placeholder="Seleccione facultad"
					/>

					<SearchSelect
						label="Carrera"
						disabled={!value.facultyId || careers.length===0}
						options={careers.length? map(careers) : [{value:'',label:' Sin carreras '}]}
						value={value.careerId}
						onChange={careerId  => onChange({ ...value, careerId })}
						placeholder="Seleccione carrera"
					/>

					<SearchSelect
						label="Asignatura"
						disabled={!value.careerId || subjects.length===0}
						options={subjects.length? map(subjects):[{value:'',label:' Sin asignaturas '}]}
						value={value.subjectId}
						onChange={subjectId => onChange({ ...value, subjectId })}
						placeholder="Seleccione asignatura"
					/>
				</SmartBox>
				<SmartBox column gap="px10" sx={{ flex:'1 1 260px' }} p='px6'>
					<SearchSelect
						label="Unidad / Tema"
						disabled={!value.subjectId || units.length===0}
						options={units.length? map(units):[{value:'',label:' Sin unidades '}]}
						value={value.unitId}
						onChange={unitId => onChange({ ...value, unitId })}
						placeholder="Seleccione unidad"
					/>

					<SearchSelect
						label="Ciclo académico"
						options={cycles.map(c=>({ value:c._id, label:cycleLabel(c) }))}
						value={value.cycleId}
						onChange={cycleId => onChange({ ...value, cycleId })}
						placeholder="Seleccione ciclo"
					/>
				</SmartBox>
			</SmartBox>
		</>
	);
};

export default CascadingSelector;
