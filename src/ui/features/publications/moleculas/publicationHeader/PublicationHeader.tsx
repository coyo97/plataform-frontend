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

import ShareIcon from '@mui/icons-material/Share';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkIcon from '@mui/icons-material/Link';
import { Menu, MenuItem } from '@mui/material';

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
	onShare?: () => string;
}
const HeaderText: React.FC<{ title:string; meta:React.ReactNode }> = ({ title, meta }) => (
	<SmartBox column center gap={0.5}>
		<Text weight="bold" size="md">{title}</Text>
		{meta}
	</SmartBox>
);

const PublicationHeader: React.FC<Props> = ({
	HOST, title, author, onAuthor, onReport, publishedAt, onShare,
}) => {
	const hasAuthor = Boolean(author?.username);

	const shareLink = onShare?.() ?? '';
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	/* avatar seguro */
	const avatarSrc = author?.profile?.profilePicture
		? `${HOST}/${author.profile.profilePicture}`
		: undefined;

		/* sub-header seguro */
		const subHeader = hasAuthor ? (
			<SmartBox row gap={1}>
				<Text size="sm" colorKey="neutral.black.500">
					Publicado por &nbsp;
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
						title={`Titulo: ${title}`}
						meta={subHeader}   // nombre + fecha
					/>
				}
				action={
					<>
						<TooltipBubble content="Reportar contenido">
							<IconButton
								ariaLabel="Reportar contenido"
								colorType="warning"
								onClick={onReport}
							>
								<ReportOutlinedIcon fontSize="small" />
							</IconButton>
						</TooltipBubble>

						{onShare && (
							<>
								<TooltipBubble content="Compartir">
									<IconButton
										ariaLabel="Compartir"
										colorType="primary"
										onClick={handleMenuOpen}
									>
										<ShareIcon fontSize="small" />
									</IconButton>
								</TooltipBubble>

								<Menu
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={handleMenuClose}
									anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
									transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								>
									<MenuItem
										component="a"
										href={`https://wa.me/?text=${encodeURIComponent(onShare())}`}
										target="_blank"
										rel="noopener noreferrer"
										onClick={handleMenuClose}
									>
										<WhatsAppIcon fontSize="small" style={{ marginRight: 8 }} />
										WhatsApp
									</MenuItem>

									<MenuItem
										component="a"
										href={`https://t.me/share/url?url=${encodeURIComponent(onShare())}`}
										target="_blank"
										rel="noopener noreferrer"
										onClick={handleMenuClose}
									>
										<TelegramIcon fontSize="small" style={{ marginRight: 8 }} />
										Telegram
									</MenuItem>

									<MenuItem
										component="a"
										href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(onShare())}`}
										target="_blank"
										rel="noopener noreferrer"
										onClick={handleMenuClose}
									>
										<FacebookIcon fontSize="small" style={{ marginRight: 8 }} />
										Facebook
									</MenuItem>

									<MenuItem
										onClick={() => {
											const link = onShare();
											if (link) {
												navigator.clipboard.writeText(link)
												.then(() => alert('📎 Enlace copiado'))
												.catch(() => alert('Error al copiar'));
											}
											handleMenuClose();
										}}
									>
										<LinkIcon fontSize="small" style={{ marginRight: 8 }} />
										Copiar enlace
									</MenuItem>
								</Menu>
							</>
						)}
					</>
				}

			/>
		);
};

export default PublicationHeader;
