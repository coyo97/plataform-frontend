import React from 'react';
import GridContainer from '../../../shared/atoms/grid/GridContainer';
import { useStreamsFeed, } from '../hooks/useStreamsFeed';
import { StreamCard } from '../molecules/StreamCard/StreamCard';
import type { Stream } from '../../../../types/stream';

interface Props {
	type?: 'live' | 'ended' | 'all';
	dense?: boolean;
	onSelect?: (s: Stream) => void;
}

const StreamList: React.FC<Props> = ({ type = 'live', dense = false, onSelect }) => {
	const { streams } = useStreamsFeed(type);

	if (!streams.length) {
		return <p>No hay streams.</p>;
	}

	return (
		<GridContainer variant={dense ? 'vertical' : 'mobile'}>
			{streams.map(s => (
				<StreamCard
					key={s._id}
					id={s._id}
					title={s.title}
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

