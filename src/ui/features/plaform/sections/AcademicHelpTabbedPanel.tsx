import React, { useState, SyntheticEvent } from 'react';
import {
	Box,
	Tabs,
	Tab,
	Paper,
	Typography,
	Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AvatarX from '../../../shared/atoms/avatar/AvatarX';
import Text from '../../../shared/atoms/typography/Text';
import DateTimeInfo from '../../../shared/atoms/dateTime/DateTimeInfo';
import HelpMeta from '../../academicHelp/molecules/HelpMeta';
import HelpStatusBadge from '../../academicHelp/atoms/HelpStatusBadge';

import { useHelpFeed } from '../../academicHelp/hook/useHelpFeed';
import { AcademicHelp } from '../../../../types/academicHelp';
import DashboardCard from './DashboardCard';

type Req = 'concept_question'|'need_notes'|'need_exam'|'need_assignment';

const labels: Record<Req, string> = {
	concept_question: 'Preguntas',
	need_notes: 'Apuntes',
	need_exam: 'Exámenes',
	need_assignment: 'Tareas',
};

const reqOrder: Req[] = [
	'concept_question',
	'need_notes',
	'need_exam',
	'need_assignment',
];

const AcademicHelpTabbedPanel: React.FC = () => {
	const navigate     = useNavigate();
	const [tab, setTab] = useState(0);
	const currentType  = reqOrder[tab];

	/* ① Hook SIN argumentos – desestructura `helps` */
	const { helps = [], loading } = useHelpFeed();

	/* ② Filtra por categoría */
	const filtered = helps.filter(
		h => (h as any).requestType === currentType,
	);
	const topRequests = filtered.slice(0, 3);

	const handleTab = (_e: SyntheticEvent, newValue: number) => setTab(newValue);

	return (
		<DashboardCard>
			<Box>
				{/* Encabezado */}
				<Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
					<Typography variant="h6" fontWeight="bold">
						Ayuda académica
					</Typography>
					<Button variant="text" size="small" onClick={() => navigate('/academic-help')}>
						Ver todas
					</Button>
				</Box>

				{/* Pestañas */}
				<Tabs
					value={tab}
					onChange={handleTab}
					variant="scrollable"
					scrollButtons
					allowScrollButtonsMobile
					sx={{ mb:2 }}
				>
					{reqOrder.map(r => <Tab key={r} label={labels[r]} />)}
				</Tabs>

				{/* Lista */}
				{loading ? (
					<Typography variant="body2">Cargando…</Typography>
				) : !topRequests.length ? (
					<Typography variant="body2">No hay solicitudes en esta categoría.</Typography>
				) : (
				topRequests.map((help: AcademicHelp) => {
					const pic = help.user?.profile?.profilePicture;
	//				const avatar = pic ? `${import.meta.env.VITE_API_URL}/${pic}` : undefined;

					return (
						<Paper
							key={help._id}
							sx={{ p:2, mb:2, cursor:'pointer' }}
							elevation={1}
							onClick={() => navigate(`/academic-help/${help._id}`)}
						>
							{/* usuario + fecha */}
							<Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
								{//						<AvatarX src={avatar} size="sm" />
								}
								<Text weight="bold">{help.user?.username ?? 'Usuario'}</Text>
								<DateTimeInfo timestamp={help.created_at} size="small" />
							</Box>

							{/* título */}
							<Text size="sm" weight="bold" sx={{ mt:0.5 }}>
								{help.topic || '(Sin título)'}
							</Text>

							{/* descripción breve */}
							{help.description && (
								<Text size="sm" colorKey="neutral.black.600">
									{help.description.slice(0, 100)}
									{help.description.length > 100 && '…'}
								</Text>
							)}

							{/* facultad / carrera / materia */}
							<Box sx={{ mt:1 }}>
								{/*						<HelpMeta
														faculty={help.faculty?.name ?? ''}
														career={help.career?.name ?? ''}
														subject={help.subject?.name ?? ''}
														semester={help.cycle?.number?.toString() ?? ''}
														/>
								  */}
							</Box>

							{/* estado */}
							<Box sx={{ mt:1 }}>
								<HelpStatusBadge status={help.status} />
							</Box>
						</Paper>
					);
				})
				)}
			</Box>
		</DashboardCard>
	);
};

export default AcademicHelpTabbedPanel;

