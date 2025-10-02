// src/ui/features/dashboard/organisms/AcademicHelpTabbedPanel.tsx
import React, { useMemo, useState, SyntheticEvent } from 'react';
import { Box, Tabs, Tab, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Text from '../../../shared/atoms/typography/Text';
import DateTimeInfo from '../../../shared/atoms/dateTime/DateTimeInfo';
import HelpStatusBadge from '../../academicHelp/atoms/HelpStatusBadge';
import { useHelpFeed } from '../../academicHelp/hook/useHelpFeed';
import { AcademicHelp } from '../../../../types/academicHelp';
import DashboardCard from './DashboardCard';

type Req = 'concept_question' | 'need_notes' | 'need_exam' | 'need_assignment';

const labels: Record<Req, string> = {
	concept_question: 'Preguntas',
	need_notes: 'Apuntes',
	need_exam: 'Exámenes',
	need_assignment: 'Tareas',
};

const reqOrder: Req[] = ['concept_question', 'need_notes', 'need_exam', 'need_assignment'];

const AcademicHelpTabbedPanel: React.FC = () => {
	const navigate = useNavigate();
	const [tab, setTab] = useState(0);
	const currentType = reqOrder[tab];

	const { helps = [], loading } = useHelpFeed();

	const filtered = useMemo(
		() => helps.filter(h => (h as any).requestType === currentType),
		[helps, currentType],
	);

	const topRequests = filtered.slice(0, 3);

	const handleTab = (_e: SyntheticEvent, newValue: number) => setTab(newValue);

	return (
		<DashboardCard>
			<Box>
				{/* Encabezado */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Text as="h3" headingLevel="h3" system="sans" colorKey="text.primary">
						Ayuda académica
					</Text>

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
					sx={{ mb: 2 }}
				>
					{reqOrder.map((r, idx) => (
						<Tab
							key={r}
							disableRipple
							sx={{
								textTransform: 'none',
								minHeight: 40,
								px: 1.5,
							}}
							label={
								<Text
									as="span"
									size="sm"
									weight={tab === idx ? 'bold' : 'medium'}
									colorKey={tab === idx ? 'primary.main' : 'text.secondary'}
								>
									{labels[r]}
								</Text>
							}
						/>
					))}
				</Tabs>

				{/* Lista */}
				{loading ? (
					<Text size="sm" colorKey="neutral.graySoft.600">
						Cargando…
					</Text>
				) : !topRequests.length ? (
					<Text size="sm" colorKey="neutral.graySoft.600">
						No hay solicitudes en esta categoría.
					</Text>
				) : (
				topRequests.map((help: AcademicHelp) => {
					const pic = help.user?.profile?.profilePicture; 
					const desc = help.description ?? '';

					return (
						<Paper
							key={help._id}
							sx={{ p: 2, mb: 2, cursor: 'pointer', borderRadius: 2 }}
							elevation={1}
							onClick={() => navigate(`/academic-help/${help._id}`)}
							role="button"
						>
							{/* usuario + fecha */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Text as="span" weight="bold" size="sm" colorKey="text.primary" system='sans'>
									{help.user?.username ?? 'Usuario'}
								</Text>
								<DateTimeInfo timestamp={help.created_at} size="small" />
							</Box>

							{/* título */}
							<Text
								as="h4"
								size="md"
								weight="bold"
								sx={{ mt: 0.5 }}
								colorKey="text.primary"
							>
								{help.topic || '(Sin título)'}
							</Text>

							{/* descripción breve */}
							{desc && (
								<Text size="sm" colorKey="neutral.graySoft.700" sx={{ mt: 0.25, lineHeight: 1.5 }}>
									{desc.length > 100 ? `${desc.slice(0, 100)}…` : desc}
								</Text>
							)}

							{/* estado */}
							<Box sx={{ mt: 1 }}>
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

