// src/ui/features/access-policies/AccessPolicyManager.tsx
import React, { useEffect, useState } from 'react';
import {
	Autocomplete, Box, Chip, Divider, IconButton, Snackbar, Alert,
	Switch, TextField, Tooltip, Table, TableBody, TableCell, TableHead, TableRow, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import SmartBox from '../../shared/atoms/box/SmartBox';
import SectionTitle from '../../shared/atoms/titles/SectionTitle';
import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../shared/atoms/buttons/ghostButton/GhostButton';
import Text from '../../shared/atoms/typography/Text';

import {
	AccessPolicy, Condition, listPolicies, createPolicy, updatePolicy, deletePolicy,
	listModules, listActions, ModuleDto, ActionDto, Op
} from '../../../async/services/accessPolicyService';
import { fetchCareers, fetchFaculties } from '../../../async/services/careerService';

// ===== Catálogos
type Career  = { _id: string; name: string };
type Faculty = { _id: string; name: string };

// --- paths soportados (coinciden con tu middleware/resolvers: careerIds/facultyIds en plural)
//     Etiquetas más amigables para el usuario:
const SUBJECT_PATHS = [
	{ value: 'actor.careerIds',   label: 'Actor • Carreras' },
	{ value: 'actor.facultyIds',  label: 'Actor • Facultades' },
	{ value: 'actor.roleIds',     label: 'Actor • Roles' },
];
const TARGET_PATHS = [
	{ value: 'target.careerIds',  label: 'Target • Carreras' },
	{ value: 'target.facultyIds', label: 'Target • Facultades' },
];

// Operadores con etiquetas legibles (value no cambia para backend)
const OPERATORS: { value: Op; label: string; hint: string }[] = [
	{ value: 'eq',       label: 'es igual a',                 hint: 'Compara un solo valor.' },
	{ value: 'neq',      label: 'es distinto de',             hint: 'Compara un solo valor.' },
	{ value: 'in',       label: 'está en la lista',           hint: 'Coincide con cualquiera de la lista.' },
	{ value: 'not_in',   label: 'no está en la lista',        hint: 'No coincide con ninguno de la lista.' },
	{ value: 'overlaps', label: 'tiene intersección con',     hint: 'Comparte al menos un elemento con la lista.' },
];

// --- util simple para inputs genéricos (cuando no sea career/faculty)
function parseValue(raw: string): any {
	if (raw.trim().startsWith('[') || raw.trim().startsWith('{')) {
		try { return JSON.parse(raw); } catch { return raw; }
	}
	if (raw.includes(',')) {
		return raw.split(',').map(s => s.trim()).filter(Boolean);
	}
	return raw.trim();
}

type CondRow = Condition & { _key: string; uiValue?: string };

function ConditionEditor({
	title, rows, setRows, pathOptions, careers, faculties
}: {
	title: string;
	rows: CondRow[];
	setRows: (rows: CondRow[]) => void;
	pathOptions: { value: string; label: string }[];
	careers: Career[];
	faculties: Faculty[];
}) {
	const addRow = () => {
		setRows([
			...rows,
			{
				_key: Math.random().toString(36).slice(2),
				path: pathOptions[0].value,
				op: 'in',
				value: [],
				uiValue: ''
			}
		]);
	};
	const updateRow = (idx: number, patch: Partial<CondRow>) => {
		const next = [...rows];
		next[idx] = { ...next[idx], ...patch };
		setRows(next);
	};
	const deleteRow = (idx: number) => {
		const next = [...rows];
		next.splice(idx, 1);
		setRows(next);
	};

	const isSingleOp = (op: Op) => op === 'eq' || op === 'neq';

	const renderValueInput = (r: CondRow, idx: number) => {
		const isCareerPath  = r.path.endsWith('careerIds');
		const isFacultyPath = r.path.endsWith('facultyIds');

		// === Carrera ===
		if (isCareerPath) {
			if (isSingleOp(r.op)) {
				const selected = careers.find(c => c._id === (typeof r.value === 'string' ? r.value : '')) ?? null;
				return (
					<Autocomplete
						sx={{ minWidth: 280 }}
						options={careers}
						value={selected}
						onChange={(_, v) => updateRow(idx, { value: v?._id ?? '' })}
						isOptionEqualToValue={(a, b) => a._id === b._id}
						getOptionLabel={c => c?.name ?? ''}
						renderInput={(p) => <TextField {...p} label="Carrera" />}
					/>
				);
			} else {
				const selected = Array.isArray(r.value)
					? careers.filter(c => (r.value as string[]).includes(c._id))
					: [];
					return (
						<Autocomplete
							multiple
							sx={{ minWidth: 360, flex: 1 }}
							options={careers}
							value={selected}
							onChange={(_, vals) => updateRow(idx, { value: vals.map(v => v._id) })}
							isOptionEqualToValue={(a, b) => a._id === b._id}
							getOptionLabel={c => c?.name ?? ''}
							renderTags={(value, getTagProps) =>
								value.map((opt, i) => <Chip {...getTagProps({ index: i })} key={opt._id} label={opt.name} />)
							}
							renderInput={(p) => <TextField {...p} label="Carreras" />}
						/>
					);
			}
		}

		// === Facultad ===
		if (isFacultyPath) {
			if (isSingleOp(r.op)) {
				const selected = faculties.find(f => f._id === (typeof r.value === 'string' ? r.value : '')) ?? null;
				return (
					<Autocomplete
						sx={{ minWidth: 280 }}
						options={faculties}
						value={selected}
						onChange={(_, v) => updateRow(idx, { value: v?._id ?? '' })}
						isOptionEqualToValue={(a, b) => a._id === b._id}
						getOptionLabel={f => f?.name ?? ''}
						renderInput={(p) => <TextField {...p} label="Facultad" />}
					/>
				);
			} else {
				const selected = Array.isArray(r.value)
					? faculties.filter(f => (r.value as string[]).includes(f._id))
					: [];
					return (
						<Autocomplete
							multiple
							sx={{ minWidth: 360, flex: 1 }}
							options={faculties}
							value={selected}
							onChange={(_, vals) => updateRow(idx, { value: vals.map(v => v._id) })}
							isOptionEqualToValue={(a, b) => a._id === b._id}
							getOptionLabel={f => f?.name ?? ''}
							renderTags={(value, getTagProps) =>
								value.map((opt, i) => <Chip {...getTagProps({ index: i })} key={opt._id} label={opt.name} />)
							}
							renderInput={(p) => <TextField {...p} label="Facultades" />}
						/>
					);
			}
		}

		// === Genérico (texto/JSON) ===
		return (
			<TextField
				sx={{ flex: 1 }}
				label="Valor (texto, a,b,c o JSON)"
				value={r.uiValue ?? ''}
				onChange={(e) => updateRow(idx, { uiValue: e.target.value })}
				onBlur={() => updateRow(idx, { value: parseValue(r.uiValue ?? '') })}
			/>
		);
	};

	return (
		<SmartBox column p="px1" radius="sm2x" shadow="xs" sx={{ backgroundColor: 'background.paper' }}>
			<Text headingLevel="h3" system="sans" sx={{ mb: 1 }}>{title}</Text>

			{rows.map((r, idx) => (
				<SmartBox key={r._key} row sx={{ gap: 8 }} mb="px1">
					<Autocomplete
						sx={{ width: 260 }}
						options={pathOptions}
						value={pathOptions.find(o => o.value === r.path) ?? null}
						onChange={(_, val) => val && updateRow(idx, { path: val.value, value: [] })}
						getOptionLabel={o => o?.label ?? ''}
						renderInput={(p) => <TextField {...p} label="Campo" />}
					/>

					<Autocomplete
						sx={{ width: 220 }}
						options={OPERATORS}
						value={OPERATORS.find(o => o.value === r.op) ?? null}
						onChange={(_, val) => val && updateRow(idx, { op: val.value })}
						getOptionLabel={o => o?.label ?? ''}
						renderInput={(p) => <TextField {...p} label="Operador" helperText={OPERATORS.find(o=>o.value===r.op)?.hint} />}
					/>

					{renderValueInput(r, idx)}

					<Tooltip title="Eliminar condición">
						<IconButton onClick={() => deleteRow(idx)}><DeleteIcon /></IconButton>
					</Tooltip>
				</SmartBox>
			))}

			<GhostButton colorType="secondary" type="button" label="Añadir condición" onClick={addRow} />
		</SmartBox>
	);
}

const AccessPolicyManager: React.FC = () => {
	// catálogos
	const [modules, setModules] = useState<ModuleDto[]>([]);
	const [actions, setActions] = useState<ActionDto[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	// listado
	const [policies, setPolicies] = useState<AccessPolicy[]>([]);
	const [loading, setLoading] = useState(true);
	// form
	const [moduleId, setModuleId] = useState<string>('');
	const [actionId, setActionId] = useState<string>('');
	const [effect, setEffect]     = useState<'allow'|'deny'>('deny');
	const [label, setLabel]       = useState<string>('');
	const [enabled, setEnabled]   = useState<boolean>(true);

	const [subjectRows, setSubjectRows] = useState<CondRow[]>([]);
	const [targetRows,  setTargetRows]  = useState<CondRow[]>([]);
	const [resourceRows,setResourceRows]= useState<CondRow[]>([]); // opcional

	// feedback
	const [snack, setSnack] = useState<{ open:boolean; msg:string; severity:'success'|'error'|'info'}>(
		{ open:false, msg:'', severity:'success' }
	);

	const reload = async () => {
		setLoading(true);
		const [mods, acts, pols, facs, cars] = await Promise.all([
			listModules().catch(()=>[]),
			listActions().catch(()=>[]),
			listPolicies().catch(()=>[]),
			fetchFaculties().catch(()=>[] as Faculty[]),
			fetchCareers().catch(()=>[] as Career[]),
		]);
		setModules(mods);
		setActions(acts);
		setPolicies(pols);
		setFaculties(facs);
		setCareers(cars);
		setLoading(false);
	};

	useEffect(()=>{ reload(); },[]);

	const resetForm = () => {
		setModuleId(''); setActionId(''); setEffect('deny'); setLabel(''); setEnabled(true);
		setSubjectRows([]); setTargetRows([]); setResourceRows([]);
	};

	const handleCreate = async () => {
		if (!moduleId || !actionId) {
			setSnack({ open:true, msg:'Selecciona módulo y acción', severity:'info' });
			return;
		}
		try {
			const payload = {
				moduleId, actionId, effect, label, enabled,
				subject: subjectRows.map(({path, op, value}) => ({ path, op, value })),
				target:  targetRows.map(({path, op, value}) => ({ path, op, value })),
				resource:resourceRows.map(({path, op, value}) => ({ path, op, value })),
			};
			await createPolicy(payload);
			resetForm();
			await reload();
			setSnack({ open:true, msg:'Política creada', severity:'success' });
		} catch (e:any) {
			console.error(e);
			setSnack({ open:true, msg:String(e?.message ?? 'Error al crear'), severity:'error' });
		}
	};

	const toggleEnabled = async (p: AccessPolicy) => {
		try {
			await updatePolicy(p._id!, { enabled: !p.enabled });
			setPolicies(prev => prev.map(x => x._id === p._id ? { ...x, enabled: !p.enabled } : x));
		} catch (e:any) {
			setSnack({ open:true, msg:String(e?.message ?? 'Error al actualizar'), severity:'error' });
		}
	};

	const handleDelete = async (p: AccessPolicy) => {
		if (!window.confirm('¿Eliminar política?')) return;
		try {
			await deletePolicy(p._id!);
			setPolicies(prev => prev.filter(x => x._id !== p._id));
			setSnack({ open:true, msg:'Política eliminada', severity:'success' });
		} catch (e:any) {
			setSnack({ open:true, msg:String(e?.message ?? 'Error al eliminar'), severity:'error' });
		}
	};

	const selectedModule = modules.find(m => m._id === moduleId) ?? null;
	const selectedAction = actions.find(a => a._id === actionId) ?? null;

	// ======= Helpers para humanizar condiciones en el listado =======
	const opLabel = (op: Op) => OPERATORS.find(o => o.value === op)?.label ?? op;
	const pathLabel = (path: string) => {
		const all = [...SUBJECT_PATHS, ...TARGET_PATHS, { value: 'resource.ownerId', label: 'Recurso • Dueño' }];
		return all.find(p => p.value === path)?.label ?? path;
	};
	const idToName = (id: string, list: { _id: string; name: string }[]) =>
		list.find(x => x._id === id)?.name ?? id;

	const humanizeValue = (path: string, value: any) => {
		const isCareer = path.endsWith('careerIds');
		const isFaculty = path.endsWith('facultyIds');
		if (Array.isArray(value)) {
			const names = value.map(v => {
				if (isCareer)  return idToName(String(v), careers);
				if (isFaculty) return idToName(String(v), faculties);
				return String(v);
			});
			return `[${names.join(', ')}]`;
		}
		if (typeof value === 'string') {
			if (isCareer)  return idToName(value, careers);
			if (isFaculty) return idToName(value, faculties);
			return value || '—';
		}
		return value != null ? String(value) : '—';
	};

	const fmtCond = (arr?: Condition[]) =>
		(arr ?? []).map((c, i) => (
			<Chip
				key={i}
				size="small"
				sx={{ mr: .5, mb: .5 }}
				label={`${pathLabel(c.path)} ${opLabel(c.op)} ${humanizeValue(c.path, c.value)}`}
			/>
	));

	return (
		<SmartBox column>
			<SmartBox mb="px2">
				<SectionTitle>Políticas de Acceso (ABAC)</SectionTitle>
			</SmartBox>

			<Text size="sm" colorKey="text.secondary" sx={{ mb: 2 }}>
				Crea reglas dinámicas seleccionando <b>carreras</b> y <b>facultades</b> sin escribir IDs.
				Ej.: <i>deny</i> en Profiles:Read para <b>Actor • Carreras está en la lista [Sistemas]</b> y <b>Target • Carreras está en la lista [Medicina]</b>.
			</Text>

			{/* Formulario de creación */}
			<SmartBox column p="px1" mb="px2" radius="sm3x" shadow="sm" sx={{ backgroundColor: 'background.paper' }}>
				<Text headingLevel="h3" system="sans" sx={{ mb: 1 }}>Nueva política</Text>

				<SmartBox row mb="px1">
					<Autocomplete
						sx={{ minWidth: 150 }}
						options={modules}
						value={selectedModule}
						onChange={(_, v) => setModuleId(v?._id ?? '')}
						getOptionLabel={(m) => m?.name ?? ''}
						renderInput={(p)=><TextField {...p} label="Módulo" />}
					/>
					<Autocomplete
						sx={{ minWidth: 150 }}
						options={actions}
						value={selectedAction}
						onChange={(_, v) => setActionId(v?._id ?? '')}
						getOptionLabel={(a) => a?.name ?? ''}
						renderInput={(p)=><TextField {...p} label="Acción" />}
					/>
					<Autocomplete
						sx={{ minWidth: 180}}
						options={[{value:'deny', label:'deny'}, {value:'allow', label:'allow'}]}
						value={{ value: effect, label: effect }}
						onChange={(_, v:any) => setEffect((v?.value ?? 'deny') as 'deny'|'allow')}
						getOptionLabel={(o)=>o?.label ?? ''}
						renderInput={(p)=><TextField {...p} label="Efecto" />}
					/>
					<TextField
						sx={{ minWidth: 150, flex: 1 }}
						label="Etiqueta (opcional)"
						value={label}
						onChange={e=>setLabel(e.target.value)}
					/>
					<Box sx={{ display:'flex', alignItems:'center' }}>
						<Text size="sm" sx={{ mr: 1 }}>Habilitada</Text>
						<Switch checked={enabled} onChange={e=>setEnabled(e.target.checked)} />
					</Box>
				</SmartBox>

				<SmartBox column sx={{ gap: 12 }}>
					<ConditionEditor
						title="Condiciones del Actor (subject)"
						rows={subjectRows}
						setRows={setSubjectRows}
						pathOptions={SUBJECT_PATHS}
						careers={careers}
						faculties={faculties}
					/>
					<ConditionEditor
						title="Condiciones del Target"
						rows={targetRows}
						setRows={setTargetRows}
						pathOptions={TARGET_PATHS}
						careers={careers}
						faculties={faculties}
					/>
					<ConditionEditor
						title="Condiciones del Recurso (opcional)"
						rows={resourceRows}
						setRows={setResourceRows}
						pathOptions={[{ value: 'resource.ownerId', label: 'Recurso • Dueño' }]}
						careers={careers}
						faculties={faculties}
					/>
				</SmartBox>

				<SmartBox row between mt="px1">
					<GhostButton colorType="secondary" type="button" label="Limpiar" onClick={resetForm} />
					<FilledButton colorType="primary" btnVariant="solid" type="button" onClick={handleCreate}>
						Crear política
					</FilledButton>
				</SmartBox>
			</SmartBox>

			<Divider />

			{/* Listado */}
			<SmartBox mt="px2" mb="px1" row between>
				<Text displayLevel="lg" system="sans" weight="medium">Políticas existentes</Text>
				{loading && <Text size="sm" colorKey="text.secondary">Cargando…</Text>}
			</SmartBox>

			<Paper variant="outlined">
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Módulo</TableCell>
							<TableCell>Acción</TableCell>
							<TableCell>Efecto</TableCell>
							<TableCell>Subject</TableCell>
							<TableCell>Target</TableCell>
							<TableCell>Enabled</TableCell>
							<TableCell>Etiqueta</TableCell>
							<TableCell align="right">Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{policies.map(p => {
							const modName = typeof p.module === 'string' ? p.module : (p.module?.name ?? '');
							const actName = typeof p.action === 'string' ? p.action : (p.action?.name ?? '');
							return (
								<TableRow key={p._id}>
									<TableCell>{modName}</TableCell>
									<TableCell>{actName}</TableCell>
									<TableCell>
										<Chip size="small" color={p.effect === 'deny' ? 'error' : 'success'} label={p.effect} />
									</TableCell>
									<TableCell>{fmtCond(p.subject)}</TableCell>
									<TableCell>{fmtCond(p.target)}</TableCell>
									<TableCell>
										<Switch checked={p.enabled} onChange={()=>toggleEnabled(p)} />
									</TableCell>
									<TableCell>{p.label ?? '—'}</TableCell>
									<TableCell align="right">
										<Tooltip title="Eliminar">
											<IconButton onClick={()=>handleDelete(p)}><DeleteIcon /></IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							);
						})}
						{policies.length === 0 && !loading && (
							<TableRow>
								<TableCell colSpan={8}>
									<Text size="sm" colorKey="text.secondary">Sin políticas</Text>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Paper>

			<Snackbar
				open={snack.open}
				autoHideDuration={4000}
				onClose={()=>setSnack(s=>({ ...s, open:false }))}
				anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
			>
				<Alert severity={snack.severity} onClose={()=>setSnack(s=>({ ...s, open:false }))}>
					{snack.msg}
				</Alert>
			</Snackbar>
		</SmartBox>
	);
};

export default AccessPolicyManager;

