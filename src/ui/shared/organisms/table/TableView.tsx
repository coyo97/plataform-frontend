import React from 'react';
import {
	useMediaQuery,
	useTheme,
	CircularProgress,
	IconButton,
	Menu,
	MenuItem,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { MoreVert } from '@mui/icons-material';

import FilledButton from '../../atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../atoms/buttons/ghostButton/GhostButton';
import Text from '../../atoms/typography/Text';
import SmartBox from '../../atoms/box/SmartBox';

import {
	TableViewProps,
	ColumnDef,
	RowAction,
	ResponsiveMode,
	BreakpointKey,
} from './tableView.types';

import {
	TableContainerBase,
	ToolbarBox,
	TableBase,
	TableHeadBase,
	TableCellBase,
	TableRowBase,
	CardsWrapper,
	CardRow,
	CardLine,
	CardActions,
} from './tableView.styles';

function shouldHideAt(hiddenAt: BreakpointKey[] | undefined, bp: BreakpointKey): boolean {
	if (!hiddenAt || hiddenAt.length === 0) return false;
	return hiddenAt.includes(bp);
}

function useResponsiveMode(mode?: ResponsiveMode): 'scroll' | 'card' {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	if (mode === 'card') return 'card';
	if (mode === 'scroll') return 'scroll';
	// auto
	return isMobile ? 'card' : 'scroll';
}

function HeaderRightClose({ onClose }: { onClose?: () => void }) {
	if (!onClose) return null;
	return (
		<IconButton size="small" onClick={onClose} aria-label="cerrar">
			<CloseRoundedIcon fontSize="small" />
		</IconButton>
	);
}

export default function TableView<T>({
	data,
	rowKey,
	columns,
	rowActions = [],
	loading,
	emptyMessage = 'Sin datos',
	zebra,
	stickyHeader,
	hoverable = true,
	dense,
	skin = 'default',
	responsiveMode = 'auto',
	toolbar,
	pagination,
	actionsAsMenu = false,
}: TableViewProps<T>) {
	const theme = useTheme();

	// Estado para menú ⋮ por fila
	const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
	const [openRowKey, setOpenRowKey] = React.useState<string | null>(null);

	const openMenu = (e: React.MouseEvent<HTMLButtonElement>, key: string) => {
		e.stopPropagation();
		setMenuAnchor(e.currentTarget);
		setOpenRowKey(key);
	};
	const closeMenu = () => {
		setMenuAnchor(null);
		setOpenRowKey(null);
	};

	const currentMode = useResponsiveMode(responsiveMode);

	const isXsOnly = useMediaQuery(theme.breakpoints.only('xs'));
	const isSmOnly = useMediaQuery(theme.breakpoints.only('sm'));
	const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
	const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
	const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));

	const currentBp: BreakpointKey =
		isXlUp ? 'xl' : isLgUp ? 'lg' : isMdUp ? 'md' : isSmOnly ? 'sm' : 'xs';

	// ===== estados vacíos / loading
	if (loading) {
		return (
			<TableContainerBase dense={dense}>
				{toolbar ? <ToolbarBox>{toolbar}</ToolbarBox> : null}
				<SmartBox center p="px8">
					<CircularProgress size={20} />
				</SmartBox>
			</TableContainerBase>
		);
	}

	if (!loading && (!data || data.length === 0)) {
		return (
			<TableContainerBase dense={dense}>
				{toolbar ? <ToolbarBox>{toolbar}</ToolbarBox> : null}
				<SmartBox center p="px8">
					<Text as="div" size="md" weight="medium">
						{emptyMessage}
					</Text>
				</SmartBox>
			</TableContainerBase>
		);
	}

	// ====== MODO CARD (móvil)
	if (currentMode === 'card') {
		return (
			<TableContainerBase dense={dense}>
				{toolbar ? <ToolbarBox>{toolbar}</ToolbarBox> : null}

				<CardsWrapper>
					{data.map((row) => {
						const key = String((row as any)[rowKey]);
						const visibleCols = columns.filter((c) => !shouldHideAt(c.hiddenAt, currentBp));

						return (
							<CardRow key={key} role="group" aria-label="fila">
								{visibleCols.map((c) => {
									const val = c.renderCell
										? c.renderCell(row)
										: c.accessor
											? (row as any)[c.accessor]
											: null;
											return (
												<CardLine key={c.id} align={c.align}>
													<div className="_label">{c.header}</div>
													<div className="_value">{val}</div>
												</CardLine>
											);
								})}

								{rowActions && rowActions.length > 0 ? (
									<CardActions>
										{actionsAsMenu ? (
											<>
												<IconButton
													aria-label="Abrir acciones"
													size="small"
													onClick={(e) => openMenu(e, key)}
												>
													<MoreVert />
												</IconButton>

												<Menu
													anchorEl={menuAnchor}
													open={Boolean(menuAnchor) && openRowKey === key}
													onClose={closeMenu}
													anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
													transformOrigin={{ vertical: 'top', horizontal: 'right' }}
												>
													{rowActions
														.filter((a) => (a.visible ? a.visible(row) : true))
														.map((a, idx) => (
															<MenuItem
																key={idx}
																onClick={(e) => {
																	e.stopPropagation();
																	closeMenu();
																	a.onClick(row);
																}}
															>
																{a.label}
															</MenuItem>
														))}
												</Menu>
											</>
										) : (
											<>
												{rowActions
													.filter((a) => (a.visible ? a.visible(row) : true))
													.map((a, idx) =>
														 a.variant === 'outline' ? (
															 <GhostButton
																 key={idx}
																 label={a.label}
																 colorType={(a.color as any) ?? 'primary'}
																 onClick={(e) => {
																	 e.stopPropagation();
																	 a.onClick(row);
																 }}
																 size="small"
															 />
													) : (
														<FilledButton
															key={idx}
															colorType={(a.color as any) ?? 'primary'}
															btnVariant={a.variant ?? 'default'}
															size="small"
															onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
																e.stopPropagation();
																a.onClick(row);
															}}
														>
															{a.label}
														</FilledButton>
													)
														)}
											</>
										)}
									</CardActions>
								) : null}
							</CardRow>
						);
					})}
				</CardsWrapper>

				{/* Paginación */}
				{pagination ? (
					<SmartBox center p="px8">
						<FilledButton
							colorType="primary"
							btnVariant="ghost"
							disabled={pagination.page <= 1}
							onClick={() => pagination.onChangePage(pagination.page - 1)}
						>
							Anterior
						</FilledButton>
						<Text as="span" size="sm" sx={{ mx: 2 }}>
							Página {pagination.page} de {pagination.totalPages}
						</Text>
						<FilledButton
							colorType="primary"
							btnVariant="ghost"
							disabled={pagination.page >= pagination.totalPages}
							onClick={() => pagination.onChangePage(pagination.page + 1)}
						>
							Siguiente
						</FilledButton>
					</SmartBox>
				) : null}
			</TableContainerBase>
		);
	}

	// ====== MODO SCROLL (desktop / tablet)
	return (
		<TableContainerBase dense={dense}>
			{toolbar ? <ToolbarBox>{toolbar}</ToolbarBox> : null}

			<TableBase>
				<TableHeadBase skin={skin} sticky={stickyHeader}>
					<TableRowBase>
						{columns.map((c) =>
									 shouldHideAt(c.hiddenAt, currentBp) ? null : (
										 <TableCellBase key={c.id} isHead align={c.align} style={{ minWidth: c.minWidth }}>
											 <SmartBox row between center>
												 <Text
													 as="span"
													 size="sm"
													 weight="medium"
													 colorKey="text.secondary"
													 sx={{ textTransform: 'uppercase', letterSpacing: 0.3 }}
												 >
													 {c.header}
												 </Text>
											 </SmartBox>
										 </TableCellBase>
						)
									)}

						{rowActions && rowActions.length > 0 ? (
							<TableCellBase isHead align="right" style={{ width: 240 }}>
								<Text
									as="span"
									size="sm"
									weight="medium"
									colorKey="text.secondary"
									sx={{ textTransform: 'uppercase', letterSpacing: 0.3 }}
								>
									Acciones
								</Text>
							</TableCellBase>
						) : null}
					</TableRowBase>
				</TableHeadBase>

				<tbody>
					{data.map((row) => {
						const key = String((row as any)[rowKey]);
						return (
							<TableRowBase key={key} zebra={zebra} hoverable={hoverable}>
								{columns.map((c) =>
											 shouldHideAt(c.hiddenAt, currentBp) ? null : (
												 <TableCellBase
													 key={c.id}
													 align={c.align}
													 truncate={c.truncate}
													 style={{ minWidth: c.minWidth }}
												 >
													 {c.renderCell
														 ? c.renderCell(row)
														 : c.accessor
															 ? (row as any)[c.accessor]
															 : null}
												 </TableCellBase>
								)
											)}

								{rowActions && rowActions.length > 0 ? (
									<TableCellBase align="right">
										{actionsAsMenu ? (
											<>
												<IconButton
													aria-label="Abrir acciones"
													size="small"
													onClick={(e) => openMenu(e, key)}
												>
													<MoreVert />
												</IconButton>

												<Menu
													anchorEl={menuAnchor}
													open={Boolean(menuAnchor) && openRowKey === key}
													onClose={closeMenu}
													anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
													transformOrigin={{ vertical: 'top', horizontal: 'right' }}
												>
													{rowActions
														.filter((a) => (a.visible ? a.visible(row) : true))
														.map((a, idx) => (
															<MenuItem
																key={idx}
																onClick={(e) => {
																	e.stopPropagation();
																	closeMenu();
																	a.onClick(row);
																}}
															>
																{a.label}
															</MenuItem>
														))}
												</Menu>
											</>
										) : (
											<>
												{rowActions
													.filter((a) => (a.visible ? a.visible(row) : true))
													.map((a, idx) =>
														 a.variant === 'outline' ? (
															 <GhostButton
																 key={idx}
																 label={a.label}
																 colorType={(a.color as any) ?? 'primary'}
																 onClick={(e) => {
																	 e.stopPropagation();
																	 a.onClick(row);
																 }}
																 size="small"
																 sx={{ ml: 1 }}
															 />
													) : (
														<FilledButton
															key={idx}
															colorType={(a.color as any) ?? 'primary'}
															btnVariant={a.variant ?? 'default'}
															size="small"
															onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
																e.stopPropagation();
																a.onClick(row);
															}}
															sx={{ ml: 1 }}
														>
															{a.label}
														</FilledButton>
													)
														)}
											</>
										)}
									</TableCellBase>
								) : null}
							</TableRowBase>
						);
					})}
				</tbody>
			</TableBase>

			{/* Paginación */}
			{pagination ? (
				<SmartBox center p="px8">
					<FilledButton
						colorType="primary"
						btnVariant="ghost"
						disabled={pagination.page <= 1}
						onClick={() => pagination.onChangePage(pagination.page - 1)}
					>
						Anterior
					</FilledButton>
					<Text as="span" size="sm" sx={{ mx: 2 }}>
						Página {pagination.page} de {pagination.totalPages}
					</Text>
					<FilledButton
						colorType="primary"
						btnVariant="ghost"
						disabled={pagination.page >= pagination.totalPages}
						onClick={() => pagination.onChangePage(pagination.page + 1)}
					>
						Siguiente
					</FilledButton>
				</SmartBox>
			) : null}
		</TableContainerBase>
	);
}

