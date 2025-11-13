// src/ui/features/access-policies/AccessPolicyManager.tsx
import React, { useEffect, useState } from 'react';
import SmartBox from '../../shared/atoms/box/SmartBox';
import Text from '../../shared/atoms/typography/Text';

import GridContainer from '../../shared/atoms/grid/GridContainer';
import GridColumn    from '../../shared/atoms/grid/GridColumn';

import PoliciesTable from './PoliciesTable';
import AccessPolicyForm, { FormState, Snack } from './AccessPolicyForm';

import {
	AccessPolicy, listPolicies, createPolicy, updatePolicy, deletePolicy,
	listModules, listActions, ModuleDto, ActionDto
} from '../../../async/services/accessPolicyService';
import { fetchCareers, fetchFaculties } from '../../../async/services/careerService';

import type { Career, Faculty, CondRow } from './components/ConditionEditor';

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
	const [state, setState] = useState<FormState>({
		moduleId: '', actionId: '', effect: 'deny', label: '', enabled: true,
		subjectRows: [], targetRows: [], resourceRows: [],
	});

	const [snack, setSnack] = useState<Snack>({ open: false, msg: '', severity: 'success' });

	const reload = async () => {
		setLoading(true);
		const [mods, acts, pols, facs, cars] = await Promise.all([
			listModules().catch(() => []),
			listActions().catch(() => []),
			listPolicies().catch(() => []),
			fetchFaculties().catch(() => [] as Faculty[]),
			fetchCareers().catch(() => [] as Career[]),
		]);
		setModules(mods); setActions(acts); setPolicies(pols); setFaculties(facs); setCareers(cars);
		setLoading(false);
	};
	useEffect(() => { reload(); }, []);

	const onChange  = (patch: Partial<FormState>) => setState(prev => ({ ...prev, ...patch }));
	const resetForm = () => setState({ moduleId: '', actionId: '', effect: 'deny', label: '', enabled: true, subjectRows: [], targetRows: [], resourceRows: [] });

	const handleCreate = async () => {
		if (!state.moduleId || !state.actionId) {
			setSnack({ open: true, msg: 'Selecciona módulo y acción', severity: 'info' });
			return;
		}
		try {
			const pick = (rows: CondRow[]) => rows.map(({ path, op, value }) => ({ path, op, value }));
			await createPolicy({
				moduleId: state.moduleId,
				actionId: state.actionId,
				effect: state.effect,
				label: state.label,
				enabled: state.enabled,
				subject: pick(state.subjectRows),
				target: pick(state.targetRows),
				resource: pick(state.resourceRows),
			});
			resetForm();
			await reload();
			setSnack({ open: true, msg: 'Política creada', severity: 'success' });
		} catch (e: any) {
			console.error(e);
			setSnack({ open: true, msg: String(e?.message ?? 'Error al crear'), severity: 'error' });
		}
	};

	const toggleEnabled = async (p: AccessPolicy) => {
		try {
			await updatePolicy(p._id!, { enabled: !p.enabled });
			setPolicies(prev => prev.map(x => x._id === p._id ? { ...x, enabled: !p.enabled } : x));
		} catch (e: any) {
			setSnack({ open: true, msg: String(e?.message ?? 'Error al actualizar'), severity: 'error' });
		}
	};

	const handleDelete = async (p: AccessPolicy) => {
		if (!window.confirm('¿Eliminar política?')) return;
		try {
			await deletePolicy(p._id!);
			setPolicies(prev => prev.filter(x => x._id !== p._id));
			setSnack({ open: true, msg: 'Política eliminada', severity: 'success' });
		} catch (e: any) {
			setSnack({ open: true, msg: String(e?.message ?? 'Error al eliminar'), severity: 'error' });
		}
	};

	return (
		<SmartBox column sx={{ overflow: 'hidden' }}>
			<GridContainer
				variant="desktopFluid"
				columns={{ xs: 4, sm: 6, md: 12 }}
				style={{ rowGap: 16 }}
			>
				{/* Formulario: ocupa todo el ancho */}
				<GridColumn span={{ xxs: 4, sm: 6, md: 12 }}>
					<AccessPolicyForm
						modules={modules}
						actions={actions}
						careers={careers}
						faculties={faculties}
						state={state}
						onChange={onChange}
						onCreate={handleCreate}
						onReset={resetForm}
						snack={snack}
						setSnack={setSnack}
					/>
				</GridColumn>

				{/* Header + estado de carga */}
				<GridColumn span={{ xxs: 4, sm: 6, md: 12 }}>
					<SmartBox mt="px1" mb="px1" row between>
						<Text displayLevel="lg" system="sans" weight="medium">Políticas existentes</Text>
						{loading && <Text size="sm" colorKey="text.secondary">Cargando…</Text>}
					</SmartBox>
				</GridColumn>

				<GridColumn span={{ xxs: 4, sm: 6, md: 12 }}>
					<PoliciesTable
						policies={policies}
						careers={careers}
						faculties={faculties}
						loading={loading}
						onToggleEnabled={toggleEnabled}
						onDelete={handleDelete}
					/>
				</GridColumn>
			</GridContainer>
		</SmartBox>
	);
};

export default AccessPolicyManager;

