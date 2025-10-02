import React from 'react';
import { MenuItem } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkIcon from '@mui/icons-material/Link';

import { ShareMenuProps } from './shareMenu.types';
import { StyledMenu } from './shareMenu.styles';

const ShareMenu: React.FC<ShareMenuProps> = ({ link, onClose }) => {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(link);
			alert('📎 Enlace copiado');
		} catch {
			alert('Error al copiar');
		}
		onClose?.();
	};

	return (
		<StyledMenu
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open
			onClose={onClose}
		>
			<MenuItem
				component="a"
				href={`https://wa.me/?text=${encodeURIComponent(link)}`}
				target="_blank"
				rel="noopener noreferrer"
				onClick={onClose}
			>
				<WhatsAppIcon fontSize="small" style={{ marginRight: 8 }} />
				WhatsApp
			</MenuItem>

			<MenuItem
				component="a"
				href={`https://t.me/share/url?url=${encodeURIComponent(link)}`}
				target="_blank"
				rel="noopener noreferrer"
				onClick={onClose}
			>
				<TelegramIcon fontSize="small" style={{ marginRight: 8 }} />
				Telegram
			</MenuItem>

			<MenuItem
				component="a"
				href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}
				target="_blank"
				rel="noopener noreferrer"
				onClick={onClose}
			>
				<FacebookIcon fontSize="small" style={{ marginRight: 8 }} />
				Facebook
			</MenuItem>

			<MenuItem onClick={handleCopy}>
				<LinkIcon fontSize="small" style={{ marginRight: 8 }} />
				Copiar enlace
			</MenuItem>
		</StyledMenu>
	);
};

export default ShareMenu;

