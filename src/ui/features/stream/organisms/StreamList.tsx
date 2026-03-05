// src/ui/features/stream/organisms/StreamList.tsx
import React from 'react';
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import { useStreamsFeed } from '../hooks/useStreamsFeed';
import { StreamCard } from '../molecules/StreamCard/StreamCard';
import SkeletonCard from '../molecules/StreamCard/StreamCard.skeleton';
import { Box, Typography } from '@mui/material';
import Text from '../../../shared/atoms/typography/Text';
import type { Stream } from '../../../../types/stream';

type StreamListType = 'live' | 'ended' | 'all';

export interface StreamListFilters {
	scheduled?: boolean;        // Programados
	mine?: boolean;             // Mis streams
	currentUserId?: string;     // opcional
	careerIds?: string[];       // NUEVO: carreras permitidas
}

const getStartTimeMs = (s: Stream): number | null => {
	const anyS = s as any;
	const candidate =
		anyS.startAt ??
		anyS.startsAt ??
		anyS.startTime ??
		anyS.scheduledAt ??
		null;

	if (!candidate) return null;
	const ms = new Date(candidate as string).getTime();
	return Number.isFinite(ms) ? ms : null;
};

interface Props {
	type?: StreamListType;
	dense?: boolean;
	onSelect?: (s: Stream) => void;
	filters?: StreamListFilters; // opcional
}

const StreamList: React.FC<Props> = ({
	type = 'live',
	dense = false,
	onSelect,
	filters,
}) => {
	const needAll = Boolean(filters?.scheduled || filters?.mine);
	const effectiveType: StreamListType = needAll ? 'all' : type;

	const { streams } = useStreamsFeed(effectiveType);

	const isLoading = streams == null;

	let items: Stream[] = streams ?? [];

	const now = Date.now();

	if (filters?.scheduled) {
		items = items.filter((s) => {
			const ms = getStartTimeMs(s);
			const isFuture = ms !== null && ms > now;
			const status = (s as any).status;
			const active = (s as any).active;
			return status === 'scheduled' || (isFuture && !active);
		});
	}

	if (filters?.mine) {
		const uid =
			filters.currentUserId ||
			(typeof window !== 'undefined' ? localStorage.getItem('uid') || '' : '');
		if (uid) {
			items = items.filter((s) => (s as any).createdBy === uid);
		}
	}

	if (filters?.careerIds && filters.careerIds.length > 0) {
		items = items.filter((s) => {
			const anyS = s as any;

			const cid: string | undefined =
				anyS.careerId ||
				(anyS.career && (anyS.career._id || anyS.career.id)) ||
				anyS.career ||
				undefined;

			if (!cid) return false;
			return filters.careerIds!.includes(cid);
		});
	}

	if (isLoading) {
		return (
			<GridContainer variant={dense ? 'vertical' : 'mobile'}>
				{Array.from({ length: 4 }).map((_, i) => (
					<SkeletonCard key={i} dense={dense} />
				))}
			</GridContainer>
		);
	}

	if (!items.length) {
		const filteringByCareer = Boolean(filters?.careerIds && filters.careerIds.length > 0);

		return (
			<Box
				sx={{
					minHeight: 160,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					px: 2,
				}}
			>
				<Text headingLevel='h2' system='italic' sx={{ mb: 0.5, fontWeight: 600 }} >
					{filteringByCareer
						? 'No hay transmisiones para la carrera seleccionada.'
						: 'No hay transmisiones disponibles en este momento.'}
				</Text>
				{filteringByCareer && (
					<Typography variant="body2" color="text.secondary">
						En este momento no hay transmisiones en vivo para tu carrera. Puedes cambiar el filtro de carrera para explorar streams de otras carreras.
					</Typography>
				)}
			</Box>
		);
	}

	return (
		<GridContainer variant={dense ? 'vertical' : 'mobile'}>
			{items.map((s) => (
				<StreamCard
					key={s._id}
					id={s._id}
					title={s.title}
					description={s.description}
					visibility={s.visibility}
					viewerCount={s.viewerCount ?? 0}
					thumbnailUrl={s.thumbnailUrl}
					isLive={(s as any).active}
					dense={dense}
					onClick={() => onSelect?.(s)}
				/>
			))}
		</GridContainer>
	);
};

export default StreamList;

