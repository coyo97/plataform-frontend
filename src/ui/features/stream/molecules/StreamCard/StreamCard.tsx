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
		<GridColumn as="article" span={dense ? 1 : 2}>
			<CardContainer onClick={onClick} dense={dense} role="button" tabIndex={0}>
				<Thumbnail
					dense={dense}
					aria-label={`Miniatura del stream ${title}`}
					style={{ backgroundImage: `url(${thumbnailUrl || '/default-thumb.jpg'})` }}
				>
					{isLive && <LiveBadge>LIVE</LiveBadge>}
				</Thumbnail>

				<Content dense={dense}>
					<Text size="md" weight="bold" as="h3" style={{ lineClamp: 2 }}>
						{title}
					</Text>

					{description && (
						<Text
							size="sm"
							as="p"
							style={{ marginTop: 4, lineClamp: 2 }}
						>
							{description}
						</Text>
					)}

					<InfoRow>
						<TagChip
							label={visibility === 'private' ? 'Privado' : 'Carrera'}
							icon={visibility === 'private' ? <LockIcon fontSize="small" /> : undefined}
						/>
						<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
							<VisibilityIcon fontSize="small" />
							<Text size="sm">
								{viewerCount}{' '}
								{viewerCount === 1 ? 'persona viendo' : 'personas viendo'}
							</Text>
						</span>
					</InfoRow>
				</Content>
			</CardContainer>
		</GridColumn>
	);
};

