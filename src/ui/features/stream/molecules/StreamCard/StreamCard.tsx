// src/ui/features/stream/molecules/StreamCard/StreamCard.tsx
import React from 'react';
import GridColumn from '../../../../shared/atoms/grid/GridColumn';
import Text from '../../../../shared/atoms/typography/Text';
import TagChip from '../../../../shared/atoms/tags/TagChip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';

import {
	CardContainer,
	Thumbnail,
	LiveBadge,
	Content,
	InfoRow,
} from './streamCard.styles';

import type { StreamCardProps } from './streamCard.types';

export const StreamCard: React.FC<StreamCardProps> = ({
	id,
	title,
	description,
	visibility,
	viewerCount,
	thumbnailUrl,
	isLive,
	onClick,
	dense = false,
}) => {
	return (
		<GridColumn span={dense ? 1 : 2}>
			<CardContainer onClick={onClick} dense={dense}>
				<Thumbnail
					dense={dense}
					style={{ backgroundImage: `url(${thumbnailUrl || '/default-thumb.jpg'})` }}
				>
					{isLive && <LiveBadge>LIVE</LiveBadge>}
				</Thumbnail>

				<Content dense={dense}>
					<Text size="md" weight="bold">{title}</Text>
					{description && (
						<Text size="sm"  style={{ marginTop: 4 }}>
							{description}
						</Text>
					)}


					<InfoRow>
						<TagChip
							label={visibility === 'private' ? 'Privado' : 'Carrera'}
							icon={visibility === 'private' ? <LockIcon fontSize="small" /> : undefined}
						/>
						<span style={{ display: 'flex', alignItems: 'center' }}>
							<VisibilityIcon fontSize="small" style={{ marginRight: 4 }} />
							<Text size="sm" weight="regular">
  {viewerCount} {viewerCount === 1 ? 'persona viendo' : 'personas viendo'}
</Text>

						</span>
					</InfoRow>
				</Content>
			</CardContainer>
		</GridColumn>
	);
};

