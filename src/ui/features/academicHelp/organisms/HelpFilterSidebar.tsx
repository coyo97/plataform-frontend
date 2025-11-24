// ui/features/academicHelp/organisms/HelpFilterSidebar.tsx
import React, { useEffect, useState } from 'react';
import Sidebar       from '../../../shared/organisms/sidebar/Sidebar';
import SearchSelect  from '../../../shared/atoms/select/SearchSelect';
import MainInput     from '../../../shared/atoms/inputs/MainInput';
import FilledButton  from '../../../shared/atoms/buttons/filledButton/FilledButton';
import SmartBox      from '../../../shared/atoms/box/SmartBox';
import { Switch, Typography, Divider, Box } from '@mui/material';

import {
	fetchFaculties, fetchCareers,
	fetchSubjects,  fetchCycles
} from '../../../../async/services/catalogService';

import { HelpFilters } from '../hook/useHelpFeed';
import Text from '../../../shared/atoms/typography/Text';

interface Props {
	open    : boolean;
	onClose : () => void;
	current : HelpFilters;
	onApply : (f: HelpFilters) => void;
	onClear : () => void;
}

const map = (arr: any[], lbl = 'name') =>
	arr.map(i => ({ value: i._id, label: i[lbl] }));

const HelpFilterSidebar: React.FC<Props> = ({
	open,
	onClose,
	current,
	onApply,
	onClear,
}) => {
	const [local, setLocal] = useState<HelpFilters>({});

	const [showAdvanced, setShowAdvanced] = useState(false);

	/* catálogos */
	const [fac, setFac] = useState<any[]>([]);
	const [car, setCar] = useState<any[]>([]);
	const [sub, setSub] = useState<any[]>([]);
	const [cyc, setCyc] = useState<any[]>([]);

	useEffect(() => {
		setLocal(current ?? {});
	}, [current, open]);

	useEffect(() => {
		fetchFaculties().then(r => setFac(r.faculties));
		fetchCycles   ().then(r => setCyc(r.cycles));
	}, []);

	useEffect(() => {
		if (!local?.facultyId) {
			setCar([]);
			setSub([]);
			return;
		}
		fetchCareers(local.facultyId).then(r => setCar(r.careers));
	}, [local?.facultyId]);

	useEffect(() => {
		if (!local?.careerId) {
			setSub([]);
			return;
		}
		fetchSubjects(local.careerId).then(r => setSub(r.subjects));
	}, [local?.careerId]);

	const handleApply = () => {
		const cleaned = Object.fromEntries(
			Object.entries(local).filter(([_, v]) => v !== undefined && v !== '')
		) as HelpFilters;

		onApply(cleaned);
	};

	const handleClear = () => {
		setLocal({});
		setShowAdvanced(false);
		onClear();
	};

	return (
		<Sidebar open={open} onClose={onClose} width={220} sticky variant="flat">
			<SmartBox column gap="px12" p="px8">
				<Text headingLevel='h3' sx={{ mb: 1 }}>
					Filtros básicos
				</Text>

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
						setLocal({
							...local,
							requestType: (v || undefined) as HelpFilters['requestType'],
						})
					}
				/>

				{/* ESTADO */}
				<SearchSelect
					label="Estado"
					value={local.status ?? ''}
					options={[
						{ value:'',         label:'Todos'    },
						{ value:'open',     label:'Abiertos' },
						{ value:'resolved', label:'Resueltos'},
					]}
					onChange={v =>
						setLocal({
							...local,
							status: (v as HelpFilters['status']) || undefined,
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

				<Divider sx={{ my: 1 }} />

				{/* Toggle para mostrar/ocultar filtros académicos */}
				<Box display="flex" alignItems="center" justifyContent="space-between">
					<Typography variant="body2">
						Filtros académicos (opcional)
					</Typography>
					<Switch
						checked={showAdvanced}
						onChange={(_, checked) => setShowAdvanced(checked)}
						size="small"
					/>
				</Box>

				{showAdvanced && (
					<>
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

						<SearchSelect
							label="Asignatura"
							disabled={!local.careerId}
							value={local.subjectId ?? ''}
							options={[{ value:'', label:'Todas' }, ...map(sub)]}
							onChange={v => setLocal({
								...local,
								subjectId: v || undefined,
							})}
						/>

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
							onChange={v => setLocal({
								...local,
								cycleId: v || undefined,
							})}
						/>
					</>
				)}

				<FilledButton
					fullWidth
					colorType="primary"
					onClick={handleApply}
				>
					Aplicar filtros
				</FilledButton>

				<FilledButton
					fullWidth
					colorType="secondary"
					variant="outlined"
					onClick={handleClear}
				>
					Limpiar
				</FilledButton>
			</SmartBox>
		</Sidebar>
	);
};

export default HelpFilterSidebar;

