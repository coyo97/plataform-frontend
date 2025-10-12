// ui/features/academicHelp/organisms/CreateHelpSidebar.tsx
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../../shared/organisms/sidebar/Sidebar';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import { fetchFaculties } from '../../../../async/services/careerService';
import { AcademicHelp } from '../../../../types/academicHelp';
import CreateHelpForm from './CreateHelpForm';

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
}

const CreateHelpSidebar: React.FC<Props> = ({
	open, onClose, onNew, onShowMyHelps, onShowAll,
	editHelp, onUpdated, editingOpen, onEditingClose, onlyMine = false,
}) => {
	const [createOpen, setCreateOpen] = useState(false);

	useEffect(() => { fetchFaculties().catch(console.error); }, []);

	const dialogOpen = createOpen || !!editingOpen;

	const closeDialog = () => {
		if (editingOpen && onEditingClose) {
			onEditingClose();
		} else {
			setCreateOpen(false);
		}
	};

	return (
		<Sidebar sticky open={open} onClose={onClose} variant="primary">
			<SmartBox column sx={{ gap: 1 }}>
				<FilledButton colorType="warning" fullWidth onClick={() => setCreateOpen(true)}>
					Pedir ayuda
				</FilledButton>

				<FilledButton
					colorType="warning"
					fullWidth
					onClick={onlyMine ? (onShowAll ?? (() => {})) : onShowMyHelps}
				>
					{onlyMine ? 'Ver todas' : 'Mis ayudas'}
				</FilledButton>
			</SmartBox>

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
		</Sidebar>
	);
};

export default CreateHelpSidebar;

