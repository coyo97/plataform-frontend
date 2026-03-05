// ui/features/academicHelp/organisms/CreateHelpSidebar.tsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../shared/organisms/sidebar/Sidebar';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import SmartBox from '../../../shared/atoms/box/SmartBox';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Tabs, Tab, Box } from '@mui/material';

import { fetchFaculties } from '../../../../async/services/careerService';
import { AcademicHelp } from '../../../../types/academicHelp';
import CreateHelpForm from './CreateHelpForm';

import SubjectManager from '../../careers/SubjectManager';
import UnitManager from '../../careers/UnitManager';

interface Props {
	open: boolean;
	onClose(): void;
	onNew(help: AcademicHelp): void;

	onShowMyHelps(): void;
	onShowAll?(): void;

	editHelp?: AcademicHelp | null;
	onUpdated?(help: AcademicHelp): void;
	editingOpen?: boolean;
	onEditingClose?(): void;
	onlyMine?: boolean;

	canCreate?: boolean;
	canViewMyHelps?: boolean;
	canManageCatalog?: boolean;
}

const CreateHelpSidebar: React.FC<Props> = ({
	open,
	onClose,
	onNew,
	onShowMyHelps,
	onShowAll,
	editHelp,
	onUpdated,
	editingOpen,
	onEditingClose,
	onlyMine = false,
	canCreate = true,
	canViewMyHelps = true,
	canManageCatalog = true,
}) => {
	const [createOpen, setCreateOpen] = useState(false);

	// diálogo para catálogo
	const [catalogOpen, setCatalogOpen] = useState(false);
	const [catalogTab, setCatalogTab] = useState(0);

	useEffect(() => {
		fetchFaculties().catch(console.error);
	}, []);

	const dialogOpen = createOpen || !!editingOpen;

	const closeDialog = () => {
		if (editingOpen && onEditingClose) {
			onEditingClose();
		} else {
			setCreateOpen(false);
		}
	};

	// Handlers simplificados (sin mensajes)
	const handleCreateClick = () => {
		setCreateOpen(true);
	};

	const handleCatalogClick = () => {
		setCatalogOpen(true);
	};

	const handleMyHelpsClick = () => {
		if (onlyMine) {
			onShowAll?.();
		} else {
			onShowMyHelps();
		}
	};

	const handleCatalogTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setCatalogTab(newValue);
	};

	return (
		<Sidebar sticky open={open} onClose={onClose} variant="primary">
			<SmartBox column sx={{ gap: 1 }}>

				{/* Botón: Pedir ayuda */}
				{canCreate && (
					<FilledButton
						colorType="warning"
						fullWidth
						onClick={handleCreateClick}
					>
						Pedir ayuda
					</FilledButton>
				)}

				{/* Botón: Mis ayudas / Ver todas */}
				{canViewMyHelps && (
					<FilledButton
						colorType="warning"
						fullWidth
						onClick={handleMyHelpsClick}
					>
						{onlyMine ? 'Ver todas' : 'Mis ayudas'}
					</FilledButton>
				)}

				{/* Botón: Configurar materias y temas */}
				{canManageCatalog && (
					<FilledButton
						colorType="warning"
						fullWidth
						onClick={handleCatalogClick}
					>
						Configurar materias y temas
					</FilledButton>
				)}

			</SmartBox>

			{/* Diálogo crear/editar ayuda */}
			<Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth scroll="paper">
				<DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
					{editingOpen && editHelp ? (
						<CreateHelpForm
							mode="edit"
							helpId={editHelp._id}
							initial={editHelp}
							onCreated={() => {}}
							onUpdated={(h) => {
								onUpdated?.(h);
								closeDialog();
							}}
						/>
					) : (
						<CreateHelpForm
							onCreated={(h) => {
								onNew(h);
								closeDialog();
							}}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Diálogo catálogos */}
			<Dialog
				open={catalogOpen}
				onClose={() => setCatalogOpen(false)}
				maxWidth="md"
				fullWidth
				scroll="paper"
			>
				<DialogTitle>Catálogo de materias y temas</DialogTitle>
				<DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
					<Box
						sx={{
							borderBottom: 1,
							borderColor: 'divider',
							mb: 2,
						}}
					>
						<Tabs
							value={catalogTab}
							onChange={handleCatalogTabChange}
							variant="scrollable"
							allowScrollButtonsMobile
						>
							<Tab label="Materias" />
							<Tab label="Unidades / Temas" />
						</Tabs>
					</Box>

					<Box sx={{ mt: 1 }}>
						{catalogTab === 0 && <SubjectManager />}
						{catalogTab === 1 && <UnitManager />}
					</Box>
				</DialogContent>
			</Dialog>
		</Sidebar>
	);
};

export default CreateHelpSidebar;

