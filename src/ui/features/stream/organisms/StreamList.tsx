// src/ui/features/stream/organisms/StreamList.tsx
import React from 'react';
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import { useStreamsFeed } from '../hooks/useStreamsFeed';
import { StreamCard } from '../molecules/StreamCard/StreamCard';
import SkeletonCard from '../molecules/StreamCard/StreamCard.skeleton'; 
import type { Stream } from '../../../../types/stream';

interface Props {
	type?: 'live' | 'ended' | 'all';
	dense?: boolean;
	onSelect?: (s: Stream) => void;
}

const StreamList: React.FC<Props> = ({
	type = 'live',
	dense = false,
	onSelect,
}) => {
	const { streams } = useStreamsFeed(type);

	const loading = !streams || streams.length === 0;

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
			{streams.map((s) => (
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
	);
};

export default StreamList;

