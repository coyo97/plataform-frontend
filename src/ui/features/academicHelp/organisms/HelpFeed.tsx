import React from 'react';
import HelpCard from '../molecules/HelpCard';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import { AcademicHelp } from '../../../../types/academicHelp';
import Paper from '@mui/material/Paper';

const HelpFeed: React.FC<{ list?: AcademicHelp[] }> = ({ list = [] }) => (
	<SmartBox column gap={1}>
		{list.map(help => (
			<Paper
				key={`${help._id}-${help.created_at}`}
				elevation={0}
				sx={{ p: 'px10', borderRadius: 5 }}
			>
				<HelpCard help={help} />
			</Paper>
		))}
	</SmartBox>
);
export default HelpFeed;
