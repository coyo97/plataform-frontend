import React from 'react';
import GridColumn from '../../../../shared/atoms/grid/GridColumn';
import Text from '../../../../shared/atoms/typography/Text';
import TagChip from '../../../../shared/atoms/tags/TagChip';

import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

import {
	CardContainer,
	Thumbnail,
	LiveBadge,
	Content,
	InfoRow,
	MetaRow,
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
	const liveLabel = 'En vivo';
	const hasThumb = Boolean(thumbnailUrl);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!onClick) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick();
		}
	};

	const visibilityLabel =
		visibility === 'private'
			? 'Privado'
			: visibility === 'career'
				? 'Carrera'
				: 'Universidad';

	return (
		<GridColumn as="article" span={dense ? 1 : 2}>
			<CardContainer
				onClick={onClick}
				onKeyDown={handleKeyDown}
				dense={dense}
				role="button"
				tabIndex={0}
				aria-label={`Abrir stream ${title}`}
			>
				<Thumbnail
					dense={dense}
					hasThumb={hasThumb}
					aria-label={`Miniatura del stream ${title}`}
					style={{
						backgroundImage: hasThumb
							? `url(${thumbnailUrl})`
							: `url('/default-thumb.jpg')`,
					}}
				>
					{isLive && (
						<LiveBadge aria-label="Transmisión en vivo">
							<span className="live-dot" />
							{liveLabel}
						</LiveBadge>
					)}
				</Thumbnail>

				<Content dense={dense}>
					<Text
						size="md"
						weight="bold"
						as="h3"
						style={{
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}}
					>
						{title}
					</Text>

					{description && (
						<Text
							size="sm"
							as="p"
							style={{
								marginTop: 4,
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
								opacity: 0.85,
							}}
						>
							{description}
						</Text>
					)}

					{/* fila meta (visibilidad / carrera / etc. si luego agregas) */}
					<MetaRow>
						<TagChip
							label={visibilityLabel}
							icon={
								visibility === 'private' ? (
									<LockIcon fontSize="small" />
								) : visibility === 'university' ? (
									<PublicIcon fontSize="small" />
								) : undefined
							}
						/>
					</MetaRow>

					{/* fila inferior: viewers */}
					<InfoRow>
						<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
							<VisibilityIcon fontSize="small" />
							<Text size="sm" aria-label="Personas viendo">
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

