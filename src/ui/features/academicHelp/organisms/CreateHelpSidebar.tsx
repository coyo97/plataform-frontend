import React, { useEffect, useState } from 'react';
import Sidebar        from '../../../shared/organisms/sidebar/Sidebar';
import FilledButton   from '../../../shared/atoms/buttons/filledButton/FilledButton';
import SmartBox       from '../../../shared/atoms/box/SmartBox';
import Dialog         from '@mui/material/Dialog';
import DialogContent  from '@mui/material/DialogContent';

import { fetchFaculties } from '../../../../async/services/careerService'; // solo para precargar catálogos
import { AcademicHelp }   from '../../../../types/academicHelp';
import CreateHelpForm     from './CreateHelpForm';

interface Props {
	open   : boolean;
	onClose(): void;
	onNew  (help: AcademicHelp): void;
}

const CreateHelpSidebar: React.FC<Props> = ({ open, onClose, onNew }) => {
	/* Sidebar state */
	const [dialogOpen, setDialogOpen] = useState(false);

	/* precarga catálogos si quieres -- opcional */
	useEffect(()=>{ fetchFaculties().catch(console.error); },[]);

	return (
		<Sidebar sticky width={220} open={open} onClose={onClose} variant="primary">
			<SmartBox>
				<FilledButton
					colorType="warning"
					fullWidth
					onClick={() => setDialogOpen(true)}
				>
					Pedir ayuda
				</FilledButton>
			</SmartBox>

			<Dialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				maxWidth="sm"
				fullWidth
				scroll="paper"
			>
				<DialogContent sx={{ p: { xs: 2, sm: 4 } }}>
					<CreateHelpForm
						onCreated={h => {
							onNew(h);
							setDialogOpen(false);
						}}
					/>
				</DialogContent>
			</Dialog>
		</Sidebar>
	);
};

export default CreateHelpSidebar;

