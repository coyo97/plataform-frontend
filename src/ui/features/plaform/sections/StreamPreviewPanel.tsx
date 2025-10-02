// src/ui/components/platform/sections/StreamPreviewPanel.tsx
import React, { useMemo } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import GridContainer from '../../../shared/atoms/grid/GridContainer';
import { useStreamsFeed } from '../../stream/hooks/useStreamsFeed';
import { StreamCard } from '../../stream/molecules/StreamCard/StreamCard';
import type { Stream } from '../../../../types/stream';
import DashboardCard from './DashboardCard';
import Text from '../../../shared/atoms/typography/Text';

interface Props {
	type?: 'live' | 'ended' | 'all';
	dense?: boolean;
	onSelect?: (s: Stream) => void;
}

const StreamPreviewPanel: React.FC<Props> = ({ type = 'live', dense = false, onSelect }) => {
	const theme = useTheme();
	const navigate = useNavigate();

	const { streams = [] } = useStreamsFeed(type);

	const topStreams = useMemo(() => streams.slice(0, 3), [streams]);

	const allHref =
		type === 'live' ? '/streams/live'
			: type === 'ended' ? '/streams/ended'
				: '/streams';

				return (
					<DashboardCard>
						<Box sx={{ mt: theme.padding?.px8 ?? 2 }}>
							{/* Encabezado */}
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									mb: theme.padding?.px2 ?? 1,
								}}
							>
								<Text as="h3" headingLevel="h3" system="sans" colorKey="text.primary">
									Clases en vivo
								</Text>

								<Button variant="text" size="small" onClick={() => navigate(allHref)}>
									Ver todas
								</Button>
							</Box>

							{/* Contenido */}
							{!topStreams.length ? (
								<Text size="sm" colorKey="neutral.graySoft.600">
									No hay streams {type === 'ended' ? 'finalizados' : type === 'live' ? 'en directo' : ''} por ahora.
								</Text>
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
											onClick={() => (onSelect ? onSelect(s) : navigate(`/streams/${s._id}`))}
										/>
									))}
								</GridContainer>
							)}
						</Box>
					</DashboardCard>
				);
};

export default StreamPreviewPanel;

