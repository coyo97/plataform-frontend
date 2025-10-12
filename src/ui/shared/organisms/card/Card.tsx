import React from 'react';
import {
	CardRoot,
	Header,
	AuthorInfo,
	Content,
	TagsWrapper,
	MediaWrapper,
	Footer,
} from './card.styles';
import { CardProps } from './card.types';
import AvatarX from '../../atoms/avatar/AvatarX';
import Badge from '../../atoms/badges/Badge';
import TooltipBubble from '../../atoms/tooltips/tooltipBubble/TooltipBubble';
import DateTimeInfo from '../../atoms/dateTime/DateTimeInfo';

const Card: React.FC<CardProps> = ({
	title,
	description,
	author,
	date,
	tags,
	media,
	actions,
	footer,
	onClickAuthor,
	onTagClick,
	headerActions,
}) => {
	return (
		<CardRoot>
			{/* Header */}
			{(author || date || headerActions) && (
				<Header>
					{author && (
						<AuthorInfo onClick={onClickAuthor} role="button" tabIndex={0}>
							<AvatarX src={author.avatarUrl} alt={author.name} size="sm" />
							<div>
								<div><strong>{author.name}</strong></div>
								{author.subtitle && <small>{author.subtitle}</small>}
							</div>
						</AuthorInfo>
					)}

					{/* Derecha del header: fecha + menú ⋮ */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						{date && <DateTimeInfo timestamp={date} />}
						{headerActions /* ⬅ AQUÍ VA EL MENÚ “⋮” */}
					</div>
				</Header>
			)}

			{/* Content */}
			<Content>
				{title && <h3>{title}</h3>}
				{description && <p>{description}</p>}
				{tags && tags.length > 0 && (
					<TagsWrapper>
						{tags.map((tag) => {
							const interactive = Boolean(onTagClick);

							return (
								<TooltipBubble
									key={tag}
									title={`#${tag}`}
									position="top"
									variant="dark"
									size="small"
									showArrow
								>
									<Badge
										variant="outline"
										color="primary"
										size="sm"
										shape="rounded"
										interactive={interactive}                          
										ariaLabel={interactive ? `Filtrar por ${tag}` : undefined}
										onClick={interactive ? () => onTagClick?.(tag) : undefined}
									>
										#{tag}
									</Badge>
								</TooltipBubble>
							);
						})}
					</TagsWrapper>
				)}



				{media && <MediaWrapper>{media}</MediaWrapper>}
			</Content>

			{/* Actions */}
			{actions}

			{/* Footer */}
			{footer && <Footer>{footer}</Footer>}
		</CardRoot>
	);
};

export default React.memo(Card);

