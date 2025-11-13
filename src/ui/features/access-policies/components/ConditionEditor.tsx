// src/ui/features/access-policies/components/ConditionEditor.tsx
// ===========================
import React from 'react';
import { Autocomplete, Chip, IconButton, TextField, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import SmartBox from '../../../shared/atoms/box/SmartBox';
import Text from '../../../shared/atoms/typography/Text';

import GridContainer from '../../../shared/atoms/grid/GridContainer';
import GridColumn from '../../../shared/atoms/grid/GridColumn';

import type { Condition, Op } from '../../../../async/services/accessPolicyService';
import type { FC } from 'react';
import { isSingleOp, parseValue } from '../utils';
import { OPERATORS } from '../constants';

export type Career = { _id: string; name: string };
export type Faculty = { _id: string; name: string };

export type CondRow = Condition & { _key: string; uiValue?: string };

type Props = {
	title: string;
	rows: CondRow[];
	setRows: (rows: CondRow[]) => void;
	pathOptions: { value: string; label: string }[];
	careers: Career[];
	faculties: Faculty[];
};

const ConditionEditor: FC<Props> = ({ title, rows, setRows, pathOptions, careers, faculties }) => {
	const addRow = () => {
		setRows([
			...rows,
			{ _key: Math.random().toString(36).slice(2), path: pathOptions[0].value, op: 'in', value: [], uiValue: '' },
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

	const renderValueInput = (r: CondRow, idx: number) => {
		const isCareerPath = r.path.endsWith('careerIds');
		const isFacultyPath = r.path.endsWith('facultyIds');

		if (isCareerPath) {
			if (isSingleOp(r.op)) {
				const selected = careers.find(c => c._id === (typeof r.value === 'string' ? r.value : '')) ?? null;
				return (
					<Autocomplete
						options={careers}
						value={selected}
						onChange={(_, v) => updateRow(idx, { value: v?._id ?? '' })}
						isOptionEqualToValue={(a, b) => a._id === b._id}
						getOptionLabel={c => c?.name ?? ''}
						renderInput={(p) => <TextField {...p} label="Carrera" />}
					/>
				);
			}
			const selected = Array.isArray(r.value) ? careers.filter(c => (r.value as string[]).includes(c._id)) : [];
			return (
				<Autocomplete
					multiple
					options={careers}
					value={selected}
					onChange={(_, vals) => updateRow(idx, { value: vals.map(v => v._id) })}
					isOptionEqualToValue={(a, b) => a._id === b._id}
					getOptionLabel={c => c?.name ?? ''}
					renderTags={(value, getTagProps) => value.map((opt, i) => <Chip {...getTagProps({ index: i })} key={opt._id} label={opt.name} />)}
					renderInput={(p) => <TextField {...p} label="Carreras" />}
				/>
			);
		}

		if (isFacultyPath) {
			if (isSingleOp(r.op)) {
				const selected = faculties.find(f => f._id === (typeof r.value === 'string' ? r.value : '')) ?? null;
				return (
					<Autocomplete
						options={faculties}
						value={selected}
						onChange={(_, v) => updateRow(idx, { value: v?._id ?? '' })}
						isOptionEqualToValue={(a, b) => a._id === b._id}
						getOptionLabel={f => f?.name ?? ''}
						renderInput={(p) => <TextField {...p} label="Facultad" />}
					/>
				);
			}
			const selected = Array.isArray(r.value) ? faculties.filter(f => (r.value as string[]).includes(f._id)) : [];
			return (
				<Autocomplete
					multiple
					options={faculties}
					value={selected}
					onChange={(_, vals) => updateRow(idx, { value: vals.map(v => v._id) })}
					isOptionEqualToValue={(a, b) => a._id === b._id}
					getOptionLabel={f => f?.name ?? ''}
					renderTags={(value, getTagProps) => value.map((opt, i) => <Chip {...getTagProps({ index: i })} key={opt._id} label={opt.name} />)}
					renderInput={(p) => <TextField {...p} label="Facultades" />}
				/>
			);
		}

		return (
			<TextField
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
				<GridContainer
					key={r._key}
					variant="desktopFluid"
					columns={{ xs: 4, sm: 6, md: 12 }}
					style={{ marginBottom: 8 }}
				>
					{/* Campo (path) */}
					<GridColumn span={{ xxs: 4, sm: 2, md: 3 }}>
						<Autocomplete
							options={pathOptions}
							value={pathOptions.find(o => o.value === r.path) ?? null}
							onChange={(_, val) => val && updateRow(idx, { path: val.value, value: [] })}
							getOptionLabel={o => o?.label ?? ''}
							renderInput={(p) => <TextField {...p} label="Campo" />}
						/>
					</GridColumn>

					{/* Operador */}
					<GridColumn span={{ xxs: 4, sm: 2, md: 3 }}>
						<Autocomplete
							options={OPERATORS}
							value={OPERATORS.find(o => o.value === r.op) ?? null}
							onChange={(_, val) => val && updateRow(idx, { op: val.value as Op })}
							getOptionLabel={o => o?.label ?? ''}
							renderInput={(p) => (
								<TextField
									{...p}
									label="Operador"
									helperText={OPERATORS.find(o => o.value === r.op)?.hint}
								/>
							)}
						/>
					</GridColumn>

					{/* Valor (varía) */}
					<GridColumn span={{ xxs: 4, sm: 4, md: 5 }}>
						{renderValueInput(r, idx)}
					</GridColumn>

					{/* Eliminar */}
					<GridColumn span={{ xxs: 4, sm: 1, md: 1 }} self={{ xxs: 'start', md: 'end' }}>
						<Tooltip title="Eliminar condición">
							<IconButton onClick={() => deleteRow(idx)}><DeleteIcon /></IconButton>
						</Tooltip>
					</GridColumn>
				</GridContainer>
			))}

			<GridContainer variant="desktopFluid" columns={{ xs: 4, sm: 6, md: 12 }}>
				<GridColumn span={{ xxs: 4, md: 3 }} self={{ xxs: 'start', md: 'start' }}>
					<button className="ghost-btn" onClick={addRow}>Añadir condición</button>
				</GridColumn>
			</GridContainer>
		</SmartBox>
	);
};

export default ConditionEditor;

