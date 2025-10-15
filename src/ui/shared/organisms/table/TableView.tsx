import React, { Fragment, useMemo } from 'react';
import { Pagination, TableRow as MuiTableRow } from '@mui/material';


import Text from '../../atoms/typography/Text';
import Badge from '../../atoms/badges/Badge';
import SmartBox from '../../atoms/box/SmartBox';
import FilledButton from '../../atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../atoms/buttons/ghostButton/GhostButton';
import IconButton from '../../atoms/buttons/iconButton/IconButton';
import Alert from '../../atoms/feedback/alert/Alert';
import Loader from '../../atoms/feedback/loader/Loader';
import InfoTooltip from '../../atoms/tooltips/infoTooltip/InfoTooltip';

import {
	TableContainerBase,
	TableBase,
	TableHeadBase,
	TableRowBase,
	TableCellBase,
	ToolbarBox,
	FooterBox,
	CardOnlyHead,
	CardCell,
} from './tableView.styles';

import { ColumnDef, RowAction, TableViewProps } from './tableView.types';

/* --- utils --- */
const getByPath = (obj: any, path?: string) => {
	if (!path) return undefined;
	// admite 'a.b.c'
	return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

function useDisplayColumns<T>(columns: ColumnDef<T>[]) {
	return useMemo(() => columns, [columns]);
}

/* --- row actions renderer --- */
function RowActions<T>({
	row,
	actions = [],
	compact = false,
}: {
	row: T;
	actions?: RowAction<T>[];
	compact?: boolean;
}) {
	if (!actions?.length) return null;

	return (
		<SmartBox row gap="px4">
			{actions.map((a, idx) => {
				const visible = a.visible ? a.visible(row) : true;
				if (!visible) return <Fragment key={idx} />;

				const disabled = a.disabled ? a.disabled(row) : false;

				// Si hay icon y estamos en modo compacto, usamos IconButton
				if (compact && a.icon) {
					return (
						<IconButton
							key={idx}
							ariaLabel={typeof a.label === 'string' ? a.label : `action-${idx}`}
							colorType={a.color ?? 'primary'}
							sizeType="sm"
							disabled={disabled}
							onClick={(e) => {
								e.stopPropagation();
								a.onClick(row);
							}}
						>
							{a.icon}
						</IconButton>
					);
				}

				// Si es primaria → FilledButton, si no → GhostButton
				const isPrimary = (a.variant ?? 'default') === 'default' || a.variant === 'soft';
				return isPrimary ? (
					<FilledButton
						key={idx}
						colorType={a.color ?? 'primary'}
						btnVariant={a.variant ?? 'default'}
						size="small"
						disabled={disabled}
					    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      a.onClick(row);
    }}
					>
						{a.label}
					</FilledButton>
				) : (
					<GhostButton
						key={idx}
						label={typeof a.label === 'string' ? a.label : `action-${idx}`}
						colorType={(a.color as any) ?? 'primary'}
						onClick={(e) => {
							e.stopPropagation();
							a.onClick(row);
						}}
					/>
				);
			})}
		</SmartBox>
	);
}

/* --- main --- */
function TableView<T>({
	data,
	rowKey,
	columns,
	rowActions,
	toolbar,
	footer,
	loading,
	error,
	emptyMessage = 'Sin datos para mostrar.',
	stickyHeader = false,
	dense = false,
	zebra = true,
	hoverable = false,
	skin = 'default',
	responsiveMode = 'scroll',
	rowHoverTone = 'default',
	pagination,
	onRowClick,
}: TableViewProps<T>) {
	const cols = useDisplayColumns(columns);

	const getRowKey = (row: T, index: number) =>
		typeof rowKey === 'function' ? rowKey(row, index) : (row as any)[rowKey];

	/* Estados superiores */
	if (loading) {
		return (
			<TableContainerBase dense={dense}>
				{toolbar ? <ToolbarBox>{toolbar}</ToolbarBox> : null}
				<SmartBox center p="px12">
					<Loader />
				</SmartBox>
			</TableContainerBase>
		);
	}

	if (error) {
		return (
			<TableContainerBase dense={dense}>
				{toolbar ? <ToolbarBox>{toolbar}</ToolbarBox> : null}
				<Alert type="error">{typeof error === 'string' ? error : error}</Alert>
			</TableContainerBase>
		);
	}

	if (!data?.length) {
		return (
			<TableContainerBase dense={dense}>
				{toolbar ? <ToolbarBox>{toolbar}</ToolbarBox> : null}
				<SmartBox center p="px12">
					<Text as="div" size="md" weight="medium">
						{emptyMessage}
					</Text>
				</SmartBox>
			</TableContainerBase>
		);
	}

	/* Responsive B: “card” */
	if (responsiveMode === 'card') {
		return (
			<TableContainerBase dense={dense}>
				{toolbar ? <ToolbarBox>{toolbar}</ToolbarBox> : null}
				<CardOnlyHead />
				{data.map((row, i) => (
					<SmartBox
						key={getRowKey(row, i)}
						radius="md"
						shadow="xs"
						sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, mb: 1 }}
						onClick={onRowClick ? () => onRowClick(row) : undefined}
					>
						{cols.map((c) => {
							const content =
								c.renderCell ? c.renderCell(row, i) : getByPath(row, c.accessor as string);
							return (
								<CardCell key={c.id} data-label={typeof c.header === 'string' ? c.header : ''}>
									<div />
									<div>
										{typeof content === 'string' || typeof content === 'number' ? (
											<Text as="span" size="sm">
												{String(content)}
											</Text>
										) : (
										content
										)}
									</div>
								</CardCell>
							);
						})}
						{rowActions ? (
							<SmartBox row gap="px8" p="px8" sx={{ justifyContent: 'flex-end' }}>
								<RowActions row={row} actions={rowActions} compact />
							</SmartBox>
						) : null}
					</SmartBox>
				))}

				{(pagination || footer) && (
					<FooterBox>
						{footer}
						{pagination && (
							<Pagination
								count={pagination.totalPages}
								page={pagination.page}
								onChange={(_, val) => pagination.onChangePage(val)}
								color="primary"
							/>
						)}
					</FooterBox>
				)}
			</TableContainerBase>
		);
	}

	/* Responsive A: tabla real + overflow-x */
	return (
		<TableContainerBase dense={dense}>
			{toolbar ? <ToolbarBox>{toolbar}</ToolbarBox> : null}

			<TableBase>
				<TableHeadBase skin={skin} sticky={stickyHeader}>
					<MuiTableRow>
						{cols.map((c) => (
							<TableCellBase key={c.id} isHead align={c.align}>
								<SmartBox row center between>
									<Text as="span" size="sm" weight="medium" sx={{ mr: 0.5 }}>
										{c.header}
									</Text>
									{c.headerTooltip ? <InfoTooltip content={c.headerTooltip} /> : null}
								</SmartBox>
							</TableCellBase>
						))}
						{rowActions ? (
							<TableCellBase isHead align="right">
								<Text as="span" size="sm" weight="medium">
									Acciones
								</Text>
							</TableCellBase>
						) : null}
					</MuiTableRow>
				</TableHeadBase>

				<tbody>
					{data.map((row, i) => {
						const key = getRowKey(row, i);
						return (
							<TableRowBase
								key={key}
								zebra={zebra}
								hoverable={!!onRowClick || hoverable}
								hoverTone={rowHoverTone}
								onClick={onRowClick ? () => onRowClick(row) : undefined}
							>
								{cols.map((c) => {
									const content =
										c.renderCell ? c.renderCell(row, i) : getByPath(row, c.accessor as string);

									const style: React.CSSProperties = {};
									if (c.minWidth) style.minWidth = c.minWidth;
									if (c.maxWidth) style.maxWidth = c.maxWidth;

									return (
										<TableCellBase
											key={`${key}-${c.id}`}
											align={c.align}
											truncate={c.truncate}
											style={style}
											sx={{
												display: {
													xxs: c.hiddenAt?.includes('xxs') ? 'none' : undefined,
													xs: c.hiddenAt?.includes('xs') ? 'none' : undefined,
													sm: c.hiddenAt?.includes('sm') ? 'none' : undefined,
											} as any,
											}}
										>
											{typeof content === 'string' || typeof content === 'number' ? (
												<Text as="span" size="sm">
													{String(content)}
												</Text>
											) : (
											content
											)}
										</TableCellBase>
									);
								})}

								{rowActions ? (
									<TableCellBase align="right">
										<RowActions row={row} actions={rowActions} />
									</TableCellBase>
								) : null}
							</TableRowBase>
						);
					})}
				</tbody>
			</TableBase>

			{(pagination || footer) && (
				<FooterBox>
					{footer}
					{pagination && (
						<Pagination
							count={pagination.totalPages}
							page={pagination.page}
							onChange={(_, val) => pagination.onChangePage(val)}
							color="primary"
						/>
					)}
				</FooterBox>
			)}
		</TableContainerBase>
	);
}

export default TableView;

