import React from 'react';
import HelpCard from '../molecules/HelpCard';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import { AcademicHelp } from '../../../../types/academicHelp';
import Paper from '@mui/material/Paper';

type Props = {
	list?: AcademicHelp[];
	onDeleted?: (id: string) => void;
	onEditRequested?: (h: AcademicHelp) => void;
};

const HelpFeed: React.FC<Props> = ({ list = [], onDeleted, onEditRequested }) => (
	<SmartBox column gap={1}>
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
				/>
			</Paper>
		))}
	</SmartBox>
);

export default HelpFeed;

