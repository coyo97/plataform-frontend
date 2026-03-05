import React, { useRef, useEffect, useState } from 'react';
import { IncomingMessage } from './IncomingMessage';
import { OutgoingMessage } from './OutgoingMessage';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
	MesgsContainer,
	MsgHistory,
	MessageInput,
	SendButton,
	MessageInputForm,
} from './message.styles';

import { Message } from '../../../types/types';
import ImagePreview from '../../shared/atoms/filePreview/ImagePreview';
import {
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Tooltip,
	IconButton,
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import ImageCropDialog from '../../shared/molecules/cropper/ImageCropDialog';
import { searchMessages } from '../../../async/services/messageService';

interface MessagesProps {
	messages: Message[];
	currentUserId: string;
	handleSendMessage: (
		messageContent: string,
		selectedFile?: File | null | undefined
	) => Promise<void>;
	handleDeleteMessage: (messageId: string) => void;
	loadMoreMessages: () => void;
	hasMoreMessages: boolean;
}

export const Messages: React.FC<MessagesProps> = ({
	messages,
	currentUserId,
	handleSendMessage,
	handleDeleteMessage,
	loadMoreMessages,
	hasMoreMessages,
}) => {
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const scrollableDivRef = useRef<HTMLDivElement | null>(null);

	const [messageContent, setMessageContent] = useState('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [cropOpen, setCropOpen] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const cameraInputRef = useRef<HTMLInputElement>(null);
	const messageInputRef = useRef<HTMLTextAreaElement>(null);

	//  Estado del buscador
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<Message[] | null>(null);
	const [searching, setSearching] = useState(false);
	const [searchError, setSearchError] = useState<string | null>(null);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const handleClearFile = () => {
		setSelectedFile(null);

		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		if (cameraInputRef.current) {
			cameraInputRef.current.value = '';
		}

		if (messageInputRef.current) {
			messageInputRef.current.focus();
		}
	};

	const handleFileSelected = (file: File | null) => {
		if (!file) {
			handleClearFile();
			return;
		}

		setSelectedFile(file);

		if (file.type.startsWith('image/')) {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		} else {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
			setPreviewUrl(null);
		}
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!messageContent.trim() && !selectedFile) return; // no enviar vacío

		handleSendMessage(messageContent, selectedFile);
		setMessageContent('');
		setSelectedFile(null);

		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		if (cameraInputRef.current) {
			cameraInputRef.current.value = '';
		}

		if (messageInputRef.current) {
			messageInputRef.current.focus();
		}
	};

	const handleDeleteMessageLocal = (messageId: string) => {
		handleDeleteMessage(messageId);
	};

	const sortMessagesByDate = (messagesArray: Message[]) => {
		return [...messagesArray].sort(
			(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		);
	};

	//  Resolver contexto de chat (chatId + isGroup) usando los mensajes actuales
	const resolveChatContext = () => {
		if (!messages.length) return null;

		const first = messages[0];
		const isGroup = !!first.isGroupMessage;

		if (isGroup) {
			const gid = (first as any).groupId;
			if (!gid) return null;
			return { chatId: String(gid), isGroup: true };
		}

		// DM: peer = el otro usuario distinto a currentUserId
		const senderId = first.sender?._id?.toString?.();
		const receiverId = (first as any).receiver?.toString?.() ?? (first as any).receiver;

		if (!senderId || !receiverId) return null;

		const peerId = senderId === currentUserId ? receiverId : senderId;
		if (!peerId) return null;

		return { chatId: String(peerId), isGroup: false };
	};

	//  Ejecutar búsqueda contra el backend
	const handleSearch = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();

		const query = searchQuery.trim();
		if (!query) {
			setSearchResults(null);
			setSearchError(null);
			return;
		}

		const ctx = resolveChatContext();
		if (!ctx) {
			setSearchError('No se pudo determinar el chat actual para buscar.');
			return;
		}

		try {
			setSearching(true);
			setSearchError(null);

			const found = await searchMessages(ctx.chatId, ctx.isGroup, query, 0, 50);
			setSearchResults(found);
		} catch (err) {
			console.error('Error searchMessages', err);
			setSearchError('Error al buscar mensajes.');
		} finally {
			setSearching(false);
		}
	};

	const handleClearSearch = () => {
		setSearchQuery('');
		setSearchResults(null);
		setSearchError(null);
	};

	// Fuente de mensajes a mostrar: feed normal o resultados de búsqueda
	const displayedMessages = searchResults ?? messages;

	// Config para InfiniteScroll (no cargar más si estamos en modo búsqueda)
	const hasMoreForScroll = searchResults ? false : hasMoreMessages;
	const loadMoreForScroll = searchResults ? () => {} : loadMoreMessages;

	useEffect(() => {
		if (messagesEndRef.current && displayedMessages.length > 0) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, searchResults, displayedMessages.length]);

	return (
		<MesgsContainer>
			{/* 🔍 Barra de búsqueda de mensajes en este chat */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 1,
					mb: 1,
				}}
			>
				<input
					type="text"
					placeholder="Buscar en esta conversación..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleSearch();
					}}
					style={{
						flex: 1,
						padding: '6px 8px',
						borderRadius: 6,
						border: '1px solid rgba(0,0,0,0.2)',
						fontSize: 13,
					}}
				/>
				<Button
					variant="outlined"
					size="small"
					onClick={handleSearch}
					disabled={searching}
				>
					{searching ? 'Buscando...' : 'Buscar'}
				</Button>
				{searchQuery && (
					<Button variant="text" size="small" onClick={handleClearSearch}>
						Limpiar
					</Button>
				)}
			</Box>

			{searchError && (
				<div
					style={{
						fontSize: 12,
						color: '#e74c3c',
						marginBottom: 4,
					}}
				>
					{searchError}
				</div>
			)}

			<div
				id="scrollableDiv"
				style={{
					height: '100%',
					overflow: 'auto',
					display: 'flex',
					flexDirection: 'column-reverse',
				}}
				ref={scrollableDivRef}
			>
				<InfiniteScroll
					dataLength={displayedMessages.length}
					next={loadMoreForScroll}
					hasMore={hasMoreForScroll}
					inverse={true}
					loader={<h4>Cargando más mensajes...</h4>}
					scrollableTarget="scrollableDiv"
					scrollThreshold={0.9}
				>
					<MsgHistory>
						{sortMessagesByDate(displayedMessages).map((msg) =>
							msg.sender._id === currentUserId ? (
								<OutgoingMessage
									key={msg._id}
									message={msg}
									onDeleteMessage={handleDeleteMessageLocal}
								/>
							) : (
								<IncomingMessage key={msg._id} message={msg} />
							)
						)}
						<div ref={messagesEndRef} />
					</MsgHistory>
				</InfiniteScroll>
			</div>

			{/* PREVIEW DEL ARCHIVO SELECCIONADO (miniatura chica + nombre + herramientas) */}
			{selectedFile && (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						marginTop: 8,
						padding: 8,
						borderRadius: 8,
						border: '1px solid rgba(0,0,0,0.1)',
						background: 'rgba(0,0,0,0.02)',
					}}
				>
					{/* Miniatura si es imagen */}
					{previewUrl && (
						<Box
							sx={{
								width: 72,
								height: 72,
								borderRadius: 2,
								overflow: 'hidden',
								flexShrink: 0,
							}}
						>
							<ImagePreview src={previewUrl} alt={selectedFile.name} />
						</Box>
					)}

					<div style={{ flex: 1, minWidth: 0 }}>
						<div
							style={{
								fontSize: 12,
								fontWeight: 600,
								marginBottom: 4,
							}}
						>
							Archivo adjunto
						</div>
						<div
							style={{
								fontSize: 12,
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								maxWidth: '100%',
							}}
							title={selectedFile.name}
						>
							{selectedFile.name}
						</div>
						<div style={{ fontSize: 11, opacity: 0.7 }}>
							{(selectedFile.size / 1024).toFixed(1)} KB
						</div>

						{/* Herramientas de imagen (solo si es imagen) */}
						{selectedFile.type.startsWith('image/') && previewUrl && (
							<Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
								<Tooltip title="Recortar imagen">
									<IconButton
										size="small"
										onClick={() => setCropOpen(true)}
										aria-label="Recortar imagen"
									>
										<EditIcon fontSize="small" />
									</IconButton>
								</Tooltip>
							</Box>
						)}
					</div>

					<button
						type="button"
						onClick={handleClearFile}
						style={{
							border: 'none',
							background: 'transparent',
							cursor: 'pointer',
							fontSize: 16,
							padding: 4,
						}}
						aria-label="Quitar archivo adjunto"
					>
						✕
					</button>
				</div>
			)}

			<MessageInputForm onSubmit={handleSubmit}>
				<MessageInput
					ref={messageInputRef}
					name="message"
					placeholder="Escribe un mensaje..."
					value={messageContent}
					onChange={(e) => setMessageContent(e.target.value)}
				/>

				{/* Botón: Adjuntar desde archivos */}
				<Tooltip title="Adjuntar archivo">
					<label
						htmlFor="fileInput"
						style={{ cursor: 'pointer', marginRight: '6px', display: 'inline-flex' }}
					>
						<IconButton component="span" size="small" aria-label="Adjuntar archivo">
							<PhotoIcon fontSize="small" />
						</IconButton>
					</label>
				</Tooltip>

				{/* Botón: Cámara (en móvil abrirá la cámara) */}
				<Tooltip title="Tomar foto con la cámara">
					<label
						htmlFor="cameraInput"
						style={{ cursor: 'pointer', marginRight: '6px', display: 'inline-flex' }}
					>
						<IconButton component="span" size="small" aria-label="Tomar foto">
							<CameraAltIcon fontSize="small" />
						</IconButton>
					</label>
				</Tooltip>

				{/* INPUT ARCHIVOS */}
				<input
					ref={fileInputRef}
					id="fileInput"
					type="file"
					style={{ display: 'none' }}
					onChange={(e) => {
						const file = e.target.files?.[0] || null;
						handleFileSelected(file);
					}}
				/>

				{/* INPUT CÁMARA (móvil) */}
				<input
					ref={cameraInputRef}
					id="cameraInput"
					type="file"
					accept="image/*"
					capture="environment"
					style={{ display: 'none' }}
					onChange={(e) => {
						const file = e.target.files?.[0] || null;
						handleFileSelected(file);
					}}
				/>

				<SendButton type="submit">➤</SendButton>
			</MessageInputForm>

			{/* Dialog de recorte */}
			{previewUrl && (
				<ImageCropDialog
					open={cropOpen}
					src={previewUrl}
					onClose={() => setCropOpen(false)}
					onApply={(file, url) => {
						// reemplazamos archivo y preview
						if (previewUrl) {
							URL.revokeObjectURL(previewUrl);
						}
						setSelectedFile(file);
						setPreviewUrl(url);
						setCropOpen(false);
					}}
				/>
			)}
		</MesgsContainer>
	);
};

