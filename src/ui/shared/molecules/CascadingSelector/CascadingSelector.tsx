// ui/shared/molecules/selector/CascadingSelector/CascadingSelector.tsx
import React, { useEffect, useMemo, useState } from 'react';
import SearchSelect, { SelectOption } from '../../atoms/select/SearchSelect';
import {
	fetchFaculties,
	fetchCareers,
	fetchSubjects,
	fetchCycles,
	fetchUnits,
} from '../../../../async/services/catalogService';
import { Faculty, Career, Subject, Cycle, Unit } from '../../../../types/catalog';
import SmartBox from '../../atoms/box/SmartBox';

export interface CascadeValue {
	facultyId?: string;
	careerId?: string;
	subjectId?: string;
	unitId?: string;
	cycleId?: string;
}

interface Props {
	value: CascadeValue;
	onChange: (v: CascadeValue) => void;
}

const CascadingSelector: React.FC<Props> = ({ value, onChange }) => {
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [units, setUnits] = useState<Unit[]>([]);
	const [cycles, setCycles] = useState<Cycle[]>([]);

	useEffect(() => {
		const load = async () => {
			try {
				const [fRes, cRes, cycRes] = await Promise.all([
					fetchFaculties(),
					fetchCareers(''),
					fetchCycles(),
				]);

				setFaculties(fRes.faculties || []);
				setCareers(cRes.careers || []);
				setCycles(cycRes.cycles || []);
			} catch (e) {
				console.error('Error cargando catálogos para CascadingSelector:', e);
			}
		};
		load();
	}, []);

	useEffect(() => {
		const loadSubjects = async () => {
			if (!value.careerId) {
				setSubjects([]);
				return;
			}
			try {
				const r = await fetchSubjects(value.careerId);
				setSubjects(r.subjects || []);
			} catch (e) {
				console.error('Error cargando subjects:', e);
				setSubjects([]);
			}
		};
		loadSubjects();
	}, [value.careerId]);

	useEffect(() => {
		const loadUnits = async () => {
			if (!value.subjectId) {
				setUnits([]);
				return;
			}
			try {
				const r = await fetchUnits(value.subjectId);
				setUnits(r.units || []);
			} catch (e) {
				console.error('Error cargando units:', e);
				setUnits([]);
			}
		};
		loadUnits();
	}, [value.subjectId]);

	const map = <T extends { _id: string; name?: string; title?: string }>(
		arr: T[],
	): SelectOption[] =>
		arr.map((o) => ({ value: o._id, label: o.name ?? o.title ?? '--' }));

	const cycleLabel = (c: Cycle) =>
		c.type === 'year'
			? `${c.year} • Anual`
			: c.type === 'semester'
				? `${c.year} • Semestre ${c.number}`
				: `${c.year} • Trimestre ${c.number}`;

	const getCareerFacultyId = (c: Career): string | undefined => {
		const raw: any = (c as any).facultyId;
		if (!raw) return undefined;
		if (typeof raw === 'string') return raw;
		return raw._id ?? undefined;
	};

	const careersForFaculty = useMemo(() => {
		if (!value.facultyId) return careers;
		return careers.filter((c) => getCareerFacultyId(c) === value.facultyId);
	}, [careers, value.facultyId]);


	const handleFacultyChange = (facultyId?: string) => {
		const next: CascadeValue = {
			...value,
			facultyId,
		};

		if (!facultyId) {
			next.careerId = undefined;
			next.subjectId = undefined;
			next.unitId = undefined;
		} else {
			const currentCareer = value.careerId
				? careers.find((c) => String(c._id) === String(value.careerId))
				: undefined;

			const stillBelongs =
				currentCareer && getCareerFacultyId(currentCareer) === facultyId;

			if (!stillBelongs) {
				next.careerId = undefined;
				next.subjectId = undefined;
				next.unitId = undefined;
			} else {
				next.subjectId = undefined;
				next.unitId = undefined;
			}
		}

		onChange(next);
	};

	const handleCareerChange = (careerId?: string) => {
		const next: CascadeValue = {
			...value,
			careerId,
			subjectId: undefined,
			unitId: undefined,
		};
		onChange(next);
	};

	const handleSubjectChange = (subjectId?: string) => {
		const next: CascadeValue = {
			...value,
			subjectId,
			// cambiar de asignatura limpia unidad
			unitId: undefined,
		};
		onChange(next);
	};

	const handleUnitChange = (unitId?: string) => {
		onChange({
			...value,
			unitId,
		});
	};

	const handleCycleChange = (cycleId?: string) => {
		onChange({
			...value,
			cycleId,
		});
	};

	return (
		<SmartBox row gap="px16" sx={{ flexWrap: 'wrap' }}>
			{/* COLUMNA 1: Facultad / Carrera / Asignatura */}
			<SmartBox column gap="px10" p="px6">
				{/* FACULTAD */}
				<SearchSelect
					label="Facultad"
					options={map(faculties)}
					value={value.facultyId}
					onChange={handleFacultyChange}
					placeholder="Seleccione facultad"
				/>

				{/* CARRERA */}
				<SearchSelect
					label="Carrera"
					disabled={!value.facultyId || careersForFaculty.length === 0}
					options={
						careersForFaculty.length
							? map(careersForFaculty)
							: [{ value: '', label: ' Sin carreras ' }]
					}
					value={value.careerId}
					onChange={handleCareerChange}
					placeholder="Seleccione carrera"
				/>

				{/* ASIGNATURA */}
				<SearchSelect
					label="Asignatura"
					disabled={!value.careerId || subjects.length === 0}
					options={
						subjects.length
							? map(subjects)
							: [{ value: '', label: ' Sin asignaturas ' }]
					}
					value={value.subjectId}
					onChange={handleSubjectChange}
					placeholder="Seleccione asignatura"
				/>
			</SmartBox>

			{/* COLUMNA 2: Unidad / Ciclo */}
			<SmartBox column gap="px10" sx={{ flex: '1 1 260px' }} p="px6">
				<SearchSelect
					label="Unidad / Tema"
					disabled={!value.subjectId || units.length === 0}
					options={
						units.length
							? map(units)
							: [{ value: '', label: ' Sin unidades ' }]
					}
					value={value.unitId}
					onChange={handleUnitChange}
					placeholder="Seleccione unidad"
				/>

				<SearchSelect
					label="Ciclo académico"
					options={cycles.map((c) => ({
						value: c._id,
						label: cycleLabel(c),
					}))}
					value={value.cycleId}
					onChange={handleCycleChange}
					placeholder="Seleccione ciclo"
				/>
			</SmartBox>
		</SmartBox>
	);
};

export default CascadingSelector;

