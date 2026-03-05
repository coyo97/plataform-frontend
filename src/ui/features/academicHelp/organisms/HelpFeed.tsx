import React from 'react';
import HelpCard from '../molecules/HelpCard';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import { AcademicHelp } from '../../../../types/academicHelp';
import Paper from '@mui/material/Paper';

type Props = {
	list?: AcademicHelp[];
	onDeleted?: (id: string) => void;
	onEditRequested?: (h: AcademicHelp) => void;
	canEdit?: boolean;
	canDelete?: boolean;
	onPermissionDenied?: (msg: string) => void;
};

const HelpFeed: React.FC<Props> = ({
	list = [],
	onDeleted,
	onEditRequested,
	canEdit = true,
	canDelete = true,
	onPermissionDenied
}) => (
	<SmartBox column gap={1}>

		{/* MENSAJE CUANDO NO HAY AYUDA ACADÉMICA */}
		{list.length === 0 && (
			<div
				style={{
					textAlign: 'center',
					padding: '32px 0',
					opacity: 0.6,
					fontSize: '14px',
					fontFamily: 'Inter, sans-serif'
				}}
			>
				Aún no hay solicitudes de ayuda académica
			</div>
		)}

		{/* LISTA DE AYUDAS */}
		{list.map(help => (
			<Paper
				key={`${help._id}-${help.created_at}`}
				elevation={0}
				sx={{ p: 'px10', borderRadius: 5 }}
			>
				<HelpCard
					help={help}
					onDeleted={onDeleted}
					onEditRequested={onEditRequested}
					canEdit={canEdit}
					canDelete={canDelete}
					onPermissionDenied={onPermissionDenied}
				/>
			</Paper>
		))}

	</SmartBox>
);

export default HelpFeed;

