// src/ui/features/stream/organisms/StreamList.tsx
import React from 'react';
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import { useStreamsFeed } from '../hooks/useStreamsFeed';
import { StreamCard } from '../molecules/StreamCard/StreamCard';
import SkeletonCard from '../molecules/StreamCard/StreamCard.skeleton';
import type { Stream } from '../../../../types/stream';

type StreamListType = 'live' | 'ended' | 'all';

export interface StreamListFilters {
	scheduled?: boolean;        // Programados
	mine?: boolean;             // Mis streams
	currentUserId?: string;     // opcional
}

interface Props {
	type?: StreamListType;
	dense?: boolean;
	onSelect?: (s: Stream) => void;
	filters?: StreamListFilters; // NUEVO (opcional)
}

/** Helper runtime: intenta leer fecha de inicio desde distintas claves comunes */
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

const StreamList: React.FC<Props> = ({
	type = 'live',
	dense = false,
	onSelect,
	filters,
}) => {
	// Si pedimos scheduled/mine, necesitamos el universo 'all' para filtrar en memoria
	const needAll = Boolean(filters?.scheduled || filters?.mine);
	const effectiveType: StreamListType = needAll ? 'all' : type;

	const { streams } = useStreamsFeed(effectiveType);

	// Respeta tu comportamiento actual de "loading"
	const loading = !streams || streams.length === 0;

	// Filtrado en memoria sin romper tipos
	let items: Stream[] = streams ?? [];

	const now = Date.now();

	if (filters?.scheduled) {
		items = items.filter((s) => {
			const ms = getStartTimeMs(s);
			const isFuture = ms !== null && ms > now;
			const status = (s as any).status;
			const active = (s as any).active;
			// Considera programado si el backend lo marca o si la fecha es futura y no está activo
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

	if (loading) {
		return (
			<GridContainer variant={dense ? 'vertical' : 'mobile'}>
				{Array.from({ length: 4 }).map((_, i) => (
					<SkeletonCard key={i} dense={dense} />
				))}
			</GridContainer>
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

