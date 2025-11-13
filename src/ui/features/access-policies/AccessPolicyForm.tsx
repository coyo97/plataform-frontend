// src/ui/features/access-policies/AccessPolicyForm.tsx
import React from 'react';
import { Autocomplete, Box, Snackbar, Alert, Switch, TextField } from '@mui/material';
import SmartBox from '../../shared/atoms/box/SmartBox';
import Text from '../../shared/atoms/typography/Text';
import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../shared/atoms/buttons/ghostButton/GhostButton';

import GridContainer from '../../shared/atoms/grid/GridContainer';
import GridColumn from '../../shared/atoms/grid/GridColumn';

import Card from '../../shared/organisms/card/Card'; // ⬅︎ NUEVO: usamos tu Card

import ConditionEditor, { CondRow, Career, Faculty } from './components/ConditionEditor';
import { RESOURCE_PATHS, SUBJECT_PATHS, TARGET_PATHS } from './constants';
import type { ModuleDto, ActionDto } from '../../../async/services/accessPolicyService';

export type Snack = { open: boolean; msg: string; severity: 'success' | 'error' | 'info' };

export type FormState = {
	moduleId: string;
	actionId: string;
	effect: 'allow' | 'deny';
	label: string;
	enabled: boolean;
	subjectRows: CondRow[];
	targetRows: CondRow[];
	resourceRows: CondRow[];
};

type Props = {
	modules: ModuleDto[];
	actions: ActionDto[];
	careers: Career[];
	faculties: Faculty[];
	state: FormState;
	onChange: (patch: Partial<FormState>) => void;
	onCreate: () => void;
	onReset: () => void;
	snack: Snack;
	setSnack: (s: Snack) => void;
};

const AccessPolicyForm: React.FC<Props> = ({
	modules, actions, careers, faculties,
	state, onChange, onCreate, onReset,
	snack, setSnack
}) => {
	const selectedModule = modules.find(m => m._id === state.moduleId) ?? null;
	const selectedAction = actions.find(a => a._id === state.actionId) ?? null;

	return (
		<>
			<Card
				title="Políticas de Acceso (ABAC)"
				description={
					<Text size="sm" colorKey="text.secondary">
						Crea reglas dinámicas seleccionando <b>carreras</b> y <b>facultades</b> sin escribir IDs.
						Ej.: <i>deny</i> en Profiles:Read para <b>Actor • Carreras está en la lista [Sistemas]</b> y <b>Target • Carreras está en la lista [Medicina]</b>.
					</Text>
				}
				footer={
					<SmartBox row between>
						<GhostButton colorType="secondary" type="button" label="Limpiar" onClick={onReset} />
						<FilledButton colorType="primary" btnVariant="solid" type="button" onClick={onCreate}>
							Crear política
						</FilledButton>
					</SmartBox>
				}
			>
				<SmartBox column sx={{ gap: 6}}>
					{/* Encabezado de filtros en grilla */}
					<GridContainer variant="desktopFluid" columns={{ xs: 4, sm: 6, md: 12 }} style={{ rowGap:6 }}>
						<GridColumn span={{ xxs: 4, sm: 2, md: 2 }}>
							<Autocomplete
								options={modules}
								value={selectedModule}
								onChange={(_, v) => onChange({ moduleId: v?._id ?? '' })}
								getOptionLabel={(m) => m?.name ?? ''}
								renderInput={(p) => <TextField {...p} label="Módulo" />}
							/>
						</GridColumn>

						<GridColumn span={{ xxs: 4, sm: 2, md: 2 }}>
							<Autocomplete
								options={actions}
								value={selectedAction}
								onChange={(_, v) => onChange({ actionId: v?._id ?? '' })}
								getOptionLabel={(a) => a?.name ?? ''}
								renderInput={(p) => <TextField {...p} label="Acción" />}
							/>
						</GridColumn>

						<GridColumn span={{ xxs: 4, sm: 2, md: 2 }}>
							<Autocomplete
								options={[{ value: 'deny', label: 'deny' }, { value: 'allow', label: 'allow' }]}
								value={{ value: state.effect, label: state.effect }}
								onChange={(_, v: any) => onChange({ effect: (v?.value ?? 'deny') as 'deny' | 'allow' })}
								getOptionLabel={(o) => o?.label ?? ''}
								renderInput={(p) => <TextField {...p} label="Efecto" />}
							/>
						</GridColumn>

						<GridColumn span={{ xxs: 4, sm: 4, md: 3 }}>
							<TextField
								label="Etiqueta (opcional)"
								value={state.label}
								onChange={e => onChange({ label: e.target.value })}
							/>
						</GridColumn>

						<GridColumn span={{ xxs: 4, sm: 2, md: 2 }} self={{ xxs: 'start', md: 'end' }}>
							<Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
								<Text size="sm" sx={{ mr: 1 }}>Habilitada</Text>
								<Switch checked={state.enabled} onChange={e => onChange({ enabled: e.target.checked })} />
							</Box>
						</GridColumn>
					</GridContainer>
					{/* Tres editores de condición — ahora en una sola columna */}
					<GridContainer variant="desktopFluid" columns={{ xs: 4, sm: 6, md: 12 }}>
						<GridColumn span={{ xxs: 11, sm: 6, md: 12 }} self='center'>
							<SmartBox column gap="px0">
								<ConditionEditor
									title="Condiciones del Actor (subject)"
									rows={state.subjectRows}
									setRows={(rows) => onChange({ subjectRows: rows })}
									pathOptions={SUBJECT_PATHS}
									careers={careers}
									faculties={faculties}
								/>

								<ConditionEditor
									title="Condiciones del Target"
									rows={state.targetRows}
									setRows={(rows) => onChange({ targetRows: rows })}
									pathOptions={TARGET_PATHS}
									careers={careers}
									faculties={faculties}
								/>

								<ConditionEditor
									title="Condiciones del Recurso (opcional)"
									rows={state.resourceRows}
									setRows={(rows) => onChange({ resourceRows: rows })}
									pathOptions={RESOURCE_PATHS}
									careers={careers}
									faculties={faculties}
								/>
							</SmartBox>
						</GridColumn>
					</GridContainer>

				</SmartBox>
			</Card>

			<Snackbar
				open={snack.open}
				autoHideDuration={4000}
				onClose={() => setSnack({ ...snack, open: false })}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
					{snack.msg}
				</Alert>
			</Snackbar>
		</>
	);
};

export default AccessPolicyForm;

