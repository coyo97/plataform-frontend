// src/ui/components/platform/sections/StreamPreviewPanel.tsx
import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import GridContainer from '../../../shared/atoms/grid/GridContainer';
import { useStreamsFeed } from '../../stream/hooks/useStreamsFeed';
import { StreamCard } from '../../stream/molecules/StreamCard/StreamCard';
import type { Stream } from '../../../../types/stream';
import DashboardCard from './DashboardCard';


interface Props {
	type?: 'live' | 'ended' | 'all';
	dense?: boolean;
	onSelect?: (s: Stream) => void;
}


const StreamPreviewPanel: React.FC<Props> = ({ type = 'live', dense = false, onSelect }) => {
	const theme = useTheme();
	const navigate = useNavigate();

	const { streams } = useStreamsFeed('live');
	const topStreams = streams.slice(0, 3);      // muestra máx. 3

	return (
		<DashboardCard>
			<Box sx={{ mt: theme.padding.px8 }}>
				{/* Encabezado */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: theme.padding.px2 }}>
					<Typography variant="h6" fontWeight="bold">
						Clases en vivo
					</Typography>

					<Button
						variant="text"
						size="small"
						onClick={() => navigate('/stream-academi')}   // ruta a tu página de streams
					>
						Ver todas
					</Button>
				</Box>

				{/* Contenido */}
				{!topStreams.length ? (
					<Typography variant="body2">No hay streams en directo por ahora.</Typography>
				) : (
					<GridContainer variant="mobile">
						{topStreams.map(s => (
							<StreamCard
								key={s._id}
								id={s._id}
								title={s.title}
								description={s.description}
								visibility={s.visibility}
								viewerCount={s.viewerCount ?? 0}
								thumbnailUrl={s.thumbnailUrl}
								isLive={s.active}
								dense={dense}
								onClick={() => onSelect?.(s)}
							/>

						))}
					</GridContainer>
				)}
			</Box>
		</DashboardCard>
	);
};

export default StreamPreviewPanel;

