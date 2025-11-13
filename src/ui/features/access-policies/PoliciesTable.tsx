// src/ui/features/access-policies/PoliciesTable.tsx
import React from 'react';
import { Chip, Switch } from '@mui/material';
import Text from '../../shared/atoms/typography/Text';

import { ColumnDef } from '../../shared/organisms/table/tableView.types';
import { RowAction } from '../../shared/organisms/table/tableView.types';
import TableView from '../../shared/organisms/table/TableView';

import type {
	AccessPolicy,
	Condition,
	Op,
} from '../../../async/services/accessPolicyService';
import { OPERATORS, SUBJECT_PATHS, TARGET_PATHS } from './constants';
import { idToName } from './utils';

export type Named = { _id: string; name: string };

type Props = {
	policies: AccessPolicy[];
	careers: Named[];
	faculties: Named[];
	loading?: boolean;
	onToggleEnabled: (p: AccessPolicy) => void;
	onDelete: (p: AccessPolicy) => void;
};

const opLabel = (op: Op) =>
	OPERATORS.find((o) => o.value === op)?.label ?? op;

const pathLabel = (path: string) => {
	const all = [
		...SUBJECT_PATHS,
		...TARGET_PATHS,
		{ value: 'resource.ownerId', label: 'Recurso • Dueño' },
	];
	return all.find((p) => p.value === path)?.label ?? path;
};

const humanizeValue = (
	path: string,
	value: any,
	careers: Named[],
	faculties: Named[]
) => {
	const isCareer = path.endsWith('careerIds');
	const isFaculty = path.endsWith('facultyIds');

	if (Array.isArray(value)) {
		const names = value.map((v) =>
								isCareer
									? idToName(String(v), careers)
									: isFaculty
										? idToName(String(v), faculties)
										: String(v)
							   );
							   return `[${names.join(', ')}]`;
	}
	if (typeof value === 'string') {
		if (isCareer) return idToName(value, careers);
		if (isFaculty) return idToName(value, faculties);
		return value || '—';
	}
	return value != null ? String(value) : '—';
};

const fmtCond = (
	arr: Condition[] | undefined,
	careers: Named[],
	faculties: Named[]
) =>
	(arr ?? []).map((c, i) => (
		<Chip
			key={`${c.path}-${i}`}
			size="small"
			sx={{ mr: 0.5, mb: 0.5 }}
			label={`${pathLabel(c.path)} ${opLabel(c.op)} ${humanizeValue(
				c.path,
				c.value,
				careers,
				faculties
			)}`}
		/>
));

const PoliciesTable: React.FC<Props> = ({
	policies,
	careers,
	faculties,
	loading,
	onToggleEnabled,
	onDelete,
}) => {
	const columns: ColumnDef<AccessPolicy>[] = [
		{
			id: 'module',
			header: 'Módulo',
			minWidth: 160,
			renderCell: (p) =>
				typeof p.module === 'string' ? p.module : p.module?.name ?? '',
		},
		{
			id: 'action',
			header: 'Acción',
			minWidth: 140,
			renderCell: (p) =>
				typeof p.action === 'string' ? p.action : p.action?.name ?? '',
		},
		{
			id: 'effect',
			header: 'Efecto',
			minWidth: 120,
			renderCell: (p) => (
				<Chip
					size="small"
					color={p.effect === 'deny' ? 'error' : 'success'}
					label={p.effect}
				/>
			),
		},
		{
			id: 'subject',
			header: 'Subject',
			minWidth: 260,
			hiddenAt: ['xs'],
			renderCell: (p) => <>{fmtCond(p.subject, careers, faculties)}</>,
		},
		{
			id: 'target',
			header: 'Target',
			minWidth: 260,
			hiddenAt: ['xs'],
			renderCell: (p) => <>{fmtCond(p.target, careers, faculties)}</>,
		},
		{
			id: 'enabled',
			header: 'Enabled',
			minWidth: 120,
			align: 'center',
			renderCell: (p) => (
				<Switch
					checked={p.enabled}
					onChange={() => onToggleEnabled(p)}
					inputProps={{ 'aria-label': 'Alternar habilitado' }}
				/>
			),
		},
		{
			id: 'label',
			header: 'Etiqueta',
			minWidth: 160,
			hiddenAt: ['xs'],
			renderCell: (p) => p.label ?? '—',
		},
	];

	const rowActions: RowAction<AccessPolicy>[] = [
		{
			label: 'Eliminar',
			color: 'error',
			onClick: (p) => onDelete(p),
		},
	];

	return (
		<TableView
			data={policies}
			rowKey="_id"
			columns={columns}
			rowActions={rowActions}
			loading={!!loading}
			emptyMessage="Sin políticas"
			zebra
			stickyHeader
			responsiveMode="auto"  
			actionsAsMenu          // ⋮ en móvil
		/>
	);
};

export default PoliciesTable;

