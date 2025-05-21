//features/publications/moleculas/publicationHeader/PublicationHeader.tsx
import React from 'react';

import AvatarX from '../../../../shared/atoms/avatar/AvatarX';
import IconButton from '../../../../shared/atoms/buttons/iconButton/IconButton';
import TooltipBubble from '../../../../shared/atoms/tooltips/tooltipBubble/TooltipBubble';
import Text from '../../../../shared/atoms/typography/Text';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import DateTimeInfo from '../../../../shared/atoms/dateTime/DateTimeInfo';

import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import { StyledHeader }   from './publicationHeader.styles';

export interface Author {
	_id: string;
	username: string;
	profile?: { profilePicture?: string };
}

interface Props {
	HOST       : string;
	title      : string;
	author?    : Author | null;      // ← puede venir null/undefined
	onAuthor   : (id: string, user: string) => void;
	onReport   : () => void;
	publishedAt: string | Date | number;
}
const HeaderText: React.FC<{ title:string; meta:React.ReactNode }> = ({ title, meta }) => (
	<SmartBox column gap={0.25}>
		<Text weight="bold" size="md">{title}</Text>
		{meta}
	</SmartBox>
);

const PublicationHeader: React.FC<Props> = ({
	HOST, title, author, onAuthor, onReport, publishedAt,
}) => {
	const hasAuthor = Boolean(author?.username);

	/* avatar seguro */
	const avatarSrc = author?.profile?.profilePicture
		? `${HOST}/${author.profile.profilePicture}`
		: undefined;

		/* sub-header seguro */
		const subHeader = hasAuthor ? (
			<SmartBox row center gap={1}>
				<Text size="sm" colorKey="neutral.black.500">
					Publicado por&nbsp;
					<strong
						style={{ cursor: 'pointer' }}
						onClick={() => author && onAuthor(author._id, author.username)}
					>
						{author!.username}
					</strong>
				</Text>
				<DateTimeInfo
					timestamp={publishedAt}
					format="relative"
					showIcon
					size="small"
					variant="compact"
				/>
			</SmartBox>
		) : (
			<Text size="sm" colorKey="neutral.black.500">Usuario eliminado</Text>
		);

		return (
			<StyledHeader
				avatar={
					<AvatarX
						src={avatarSrc}
						alt={author?.username ?? 'autor'}
						size="md"
						onClick={() => hasAuthor && author && onAuthor(author._id, author.username)}
						sx={{ cursor: hasAuthor ? 'pointer' : 'default' }}
					/>
				}
				title={
					<HeaderText
						title={title}
						meta={subHeader}   // nombre + fecha
					/>
				}
				action={
					<TooltipBubble content="Reportar contenido">
						<IconButton
							ariaLabel="Reportar contenido"
							colorType="warning"
							onClick={onReport}
						>
							<ReportOutlinedIcon fontSize="small" />
						</IconButton>
					</TooltipBubble>
				}
			/>
		);
};

export default PublicationHeader;
