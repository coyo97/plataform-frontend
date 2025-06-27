import React from 'react';
import {
	CardContainer,
	Thumbnail,
	Content,
	InfoRow,
} from './streamCard.styles';

import Skeleton from '@mui/material/Skeleton';

interface Props {
	dense?: boolean;
}

const SkeletonCard: React.FC<Props> = ({ dense = false }) => {
	return (
		<CardContainer dense={dense}>
			<Thumbnail dense={dense}>
				<Skeleton
					variant="rectangular"
					width="100%"
					height="100%"
					style={{ position: 'absolute', top: 0, left: 0 }}
				/>
			</Thumbnail>

			<Content dense={dense}>
				<Skeleton variant="text" width="80%" height={24} />
				<Skeleton variant="text" width="90%" height={18} />
				<InfoRow>
					<Skeleton variant="rectangular" width={80} height={24} />
					<Skeleton variant="text" width={100} height={18} />
				</InfoRow>
			</Content>
		</CardContainer>
	);
};

export default SkeletonCard;

