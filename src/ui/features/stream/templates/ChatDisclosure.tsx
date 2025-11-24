// src/ui/features/stream/templates/ChatDisclosure.tsx
import React from 'react';
import {
	Drawer,
	Tooltip,
	Badge,
	Fab,
	Zoom,
	useMediaQuery,
	useTheme,
	Box,
	AppBar,
	Toolbar,
	IconButton as MuiIconButton,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';

import SmartBox from '../../../shared/atoms/box/SmartBox';
import Text from '../../../shared/atoms/typography/Text';

interface Props {
	open: boolean;
	onOpen: () => void;
	onClose: () => void;
	children: React.ReactNode;
	unreadCount?: number;
}

const ChatDisclosure: React.FC<Props> = ({
	open,
	onOpen,
	onClose,
	children,
	unreadCount = 0,
}) => {
	const theme = useTheme();
	const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<>
			{/* BOTÓN FLOTANTE */}
			<SmartBox style={{ position: 'fixed', right: 20, bottom: 110, zIndex: 1400, display: open ? 'none' : 'block', }}>
				<Zoom in={!open}>
					<Box>
						<Tooltip title="Abrir chat" placement="left" arrow>
							<Badge
								color="error"
								overlap="circular"
								badgeContent={unreadCount > 0 ? unreadCount : 0}
								invisible={unreadCount <= 0}
							>
								<Fab
									onClick={onOpen}
									aria-label="Abrir chat del stream"
									size="medium"
									sx={{
										width: 48,
										height: 48,
										borderRadius: 999,
										backgroundColor: 'rgba(16, 20, 26, 0.92)',
										color: '#fff',
										border: '1px solid rgba(255,255,255,0.12)',
										boxShadow: '0 10px 26px rgba(0,0,0,0.45)',
										backdropFilter: 'blur(6px)',
									}}
								>
									<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 22 }} />
								</Fab>
							</Badge>
						</Tooltip>

						{isMdUp && (
							<Box
								sx={{
									position: 'absolute',
									right: 58,
									top: '50%',
									transform: 'translateY(-50%)',
									px: 1.2,
									py: 0.6,
									borderRadius: 999,
									background: 'rgba(16, 20, 26, 0.92)',
									color: '#fff',
								}}
							>
								<Text size="sm" weight="bold" as="span">Chat</Text>
							</Box>
						)}
					</Box>
				</Zoom>
			</SmartBox>

			{/* DRAWER */}
			<Drawer
				anchor="right"
				open={open}
				onClose={onClose}
				ModalProps={{
					keepMounted: true, 
				}}
				PaperProps={{
					sx: {
						width: { xs: '100%', sm: 360, md: 400 },
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: 'background.paper',
				},
				}}
			>
				{/* Header solo en móvil */}
				{isMobile && (
					<AppBar position="sticky" color="default" elevation={1}>
						<Toolbar sx={{ gap: 1 }}>
							<MuiIconButton edge="start" onClick={onClose} aria-label="Volver al stream">
								<ArrowBackIosNewRoundedIcon />
							</MuiIconButton>

							<Text weight="bold">Chat en vivo</Text>
						</Toolbar>
					</AppBar>
				)}

				<SmartBox column style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
					{children}
				</SmartBox>
			</Drawer>
		</>
	);
};

export default ChatDisclosure;

