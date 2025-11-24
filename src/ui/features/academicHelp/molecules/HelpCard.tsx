import React from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Chip as MuiChip,
	Paper,
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Card from '../../../shared/organisms/card/Card';
import CardActions from '../../../shared/molecules/cardActions/CardActions';
import ActionMenu from '../../../shared/molecules/actionMenu/ActionMenu';

import HelpStatusBadge from '../atoms/HelpStatusBadge';
import Loader from '../../../shared/atoms/feedback/loader/Loader';
import HelpMessageCard from './HelpMessageCard';
import HelpResponseForm from '../organisms/HelpResponseForm';
import RenderFile from '../../../shared/organisms/renderFile/RenderFile';

import {
	fetchThread,
	postMessage,
	voteMessage,
	markSolution,
	deleteMyHelp,
	updateMessage,
	deleteMessage,
} from '../../../../async/services/academicHelpService';

import type { AcademicHelp } from '../../../../types/academicHelp';
import type { HelpThread } from '../../../../types/helpThread';

import getEnvVariables from '../../../../config/configEnvs';
import { getUserId } from '../../../../utils/auth/getUserId';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import Text from '../../../shared/atoms/typography/Text';

const { HOST } = getEnvVariables();

type Props = {
	help: AcademicHelp;
	onDeleted?: (id: string) => void;
	onEditRequested?: (help: AcademicHelp) => void;
	canEdit?: boolean;
	canDelete?: boolean;
	onPermissionDenied?: (msg: string) => void;
};

const HelpCard: React.FC<Props> = ({
	help,
	onDeleted,
	onEditRequested,
	canEdit = true,
	canDelete = true,
	onPermissionDenied,
}) => {
	const [open, setOpen] = React.useState(false);
	const [busy, setBusy] = React.useState(false);
	const [thread, setThread] = React.useState<HelpThread | null>(null);

	const [editingMsg, setEditingMsg] = React.useState<any | null>(null);
	const [editContent, setEditContent] = React.useState('');
	const [editFile, setEditFile] = React.useState<File | null>(null);

	const uid = getUserId();
	const isOwner = (help as any)?.user?._id === uid;

	const navigate = useNavigate();
	const location = useLocation();

	const avatarSrc = help.user?.profile?.profilePicture
		? `${HOST}/${help.user.profile.profilePicture}`
		: undefined;

		const tags: string[] = [];
		const facName     = (help as any)?.facultyId?.name || (help as any)?.faculty;
		const careerName  = (help as any)?.careerId?.name;
		const subjectName = (help as any)?.subjectId?.name || (help as any)?.subject;
		const unitName    = (help as any)?.unitId?.name;
		const cycleName   = (help as any)?.cycleId?.name || (help as any)?.semester;

		if (facName)     tags.push(`Facultad: ${facName}`);
		if (careerName)  tags.push(`Carrera: ${careerName}`);
		if (subjectName) tags.push(`Asignatura: ${subjectName}`);
		if (unitName)    tags.push(`Unidad: ${unitName}`);
		if (cycleName)   tags.push(`Ciclo: ${cycleName}`);

		const guessMime = (path: string): string => {
			const clean = path.split('?')[0].toLowerCase();
			if (/\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(clean)) return 'image/*';
			if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(clean)) return 'video/*';
			if (/\.(pdf)$/i.test(clean)) return 'application/pdf';
			return 'application/octet-stream';
		};

		const loadThread = async () => {
			setBusy(true);
			const { thread } = await fetchThread(help._id as any);
			setThread(thread);
			setBusy(false);
		};

		const refresh = async () => {
			const { thread } = await fetchThread(help._id as any);
			setThread(thread);
		};

		const handleOpen = async () => {
			if (!thread) await loadThread();
			setOpen(true);
		};

		const handleClose = () => {
			setOpen(false);
			setEditingMsg(null);
		};

		const post = async (c: string, f?: File) => {
			await postMessage(help._id as any, { content: c, file: f });
			refresh();
		};
		const vote = async (tid: string, mid: string) => {
			await voteMessage(tid, mid);
			refresh();
		};
		const solve = async (tid: string, mid: string) => {
			await markSolution(tid, mid);
			refresh();
		};

		const replies = thread?.messages.length ?? 0;

		const [searchParams, setSearchParams] = useSearchParams();

		const idOr = (maybe: any): string | undefined => {
			if (!maybe) return undefined;
			if (typeof maybe === 'string') return maybe;
			if (typeof maybe === 'object' && maybe._id) return String(maybe._id);
			return undefined;
		};

		const handleTagClick = (txt: string) => {
			const [label, ...rest] = txt.split(':');
			const value = rest.join(':').trim();

			const next = new URLSearchParams(searchParams);
			['facultyId','careerId','subjectId','unitId','cycleId','subject'].forEach(k => next.delete(k));

			if (label === 'Facultad') {
				const id = idOr((help as any).facultyId);
				if (id) next.set('facultyId', id);
			}
			if (label === 'Carrera') {
				const id = idOr((help as any).careerId);
				if (id) next.set('careerId', id);
			}
			if (label === 'Asignatura') {
				const id = idOr((help as any).subjectId);
				if (id) next.set('subjectId', id);
				else    next.set('subject', value); // legacy
			}
			if (label === 'Unidad') {
				const id = idOr((help as any).unitId);
				if (id) next.set('unitId', id);
			}
			if (label === 'Ciclo') {
				const id = idOr((help as any).cycleId);
				if (id) next.set('cycleId', id);
			}

			setSearchParams(next);
		};

		const [menuOpen, setMenuOpen] = React.useState(false);
		const openMenu  = () => setMenuOpen(true);
		const closeMenu = () => setMenuOpen(false);

		const [confirmOpen, setConfirmOpen] = React.useState(false);
		const askDelete = () => {
			closeMenu();
			setConfirmOpen(true);
		};
		const cancelDelete = () => setConfirmOpen(false);

		const doDelete = async () => {
			try {
				await deleteMyHelp(help._id);
				setConfirmOpen(false);
				onDeleted?.(help._id);
			} catch (e) {
				console.error(e);
				setConfirmOpen(false);
			}
		};

		const handleEdit = () => {
			closeMenu();
			onEditRequested?.(help);
		};

		const handleSave = () => {
			console.info('Guardar ayuda (TODO)');
		};

		const onEditMessage = (msg: any) => {
			setEditingMsg(msg);
			setEditContent(msg.content || '');
			setEditFile(null);
		};

		const onDeleteMessageHandler = async (msg: any) => {
			if (!window.confirm('¿Eliminar este mensaje?')) return;
			await deleteMessage(help._id as any, msg._id);
			await refresh();
			setEditingMsg(null);
		};

		const onSaveEdit = async () => {
			if (!editingMsg) return;

			const fd = new FormData();
			fd.append('content', editContent);

			if (editFile) {
				fd.append('file', editFile);
			} else {
				fd.append('removeAttachment', 'true');
			}

			await updateMessage(help._id as any, editingMsg._id, fd);
			setEditingMsg(null);
			await refresh();
		};

		return (
			<>
				<Card
					title={help.topic || '(Sin título)'}
					description={
						help.description
							? `${help.description.slice(0, 140)}${help.description.length > 140 ? '…' : ''}`
							: undefined
					}
					author={
						(help as any).user
							? {
								name: (help as any).user.username,
								avatarUrl: avatarSrc,
							}
							: undefined
					}
					date={help.created_at}
					tags={tags}
					onTagClick={handleTagClick}
					media={
						help.fileUrl ? (
							<RenderFile
								filePath={help.fileUrl}
								fileType={guessMime(help.fileUrl)}
								title={help.topic || 'Adjunto'}
								authorName={(help as any).user?.username}
								baseUrl={HOST}
								enableZoom
								elevation={1}
								maxFeedHeight="min(60vh, 520px)"
								previewVariant="cover"
								buttonLabels={{ viewPdf: 'Ver PDF', download: 'Descargar archivo' }}
							/>
					) : null
					}
					footer={<HelpStatusBadge status={help.status} />}
					actions={
						<CardActions
							commentsCount={replies}
							showLike={false}
							showShare={false}
							showReport={false}
							onComments={handleOpen}
						/>
					}
					headerActions={
						<>
							<IconButton
								aria-label="Más opciones de solicitud"
								onClick={openMenu}
								size="small"
							>
								<MoreVertIcon />
							</IconButton>

							{menuOpen && (
								<ActionMenu
									isOwner={isOwner}
									link={`${window.location.origin}/help/${help._id}`}
									onEdit={handleEdit}
									onDelete={askDelete}
									onReport={() => console.info('Reportar ayuda (TODO)')}
									onSave={handleSave}
									onClose={closeMenu}
									canEdit={isOwner && canEdit}
									canDelete={isOwner && canDelete}
									onPermissionDenied={onPermissionDenied}
								/>
							)}
						</>
					}
				/>

				{/* Hilo de respuestas */}
				<Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
					<DialogTitle>Respuestas de la solicitud</DialogTitle>
					<DialogContent dividers>
						{busy && <Loader size="small" />}
						{!busy && (
							<>
								{thread && thread.messages.length ? (
									thread.messages.map((m) => (
										<HelpMessageCard
											key={m._id}
											message={m}
											solved={thread!.solvedMessage === m._id}
											onVote={() => vote(thread!._id, m._id)}
											onSolve={() => solve(thread!._id, m._id)}
											onEdit={onEditMessage}
											onDelete={onDeleteMessageHandler}
										/>
									))
								) : (
									<p style={{ color: '#666' }}>Sin respuestas aún</p>
								)}

								{editingMsg && (
									<Paper elevation={1} sx={{ mt: 2, p: 2 }}>
										<Text weight="bold" size="sm">
											Editar respuesta
										</Text>

										<textarea
											style={{
												width: '100%',
												marginTop: 8,
												minHeight: 80,
												resize: 'vertical',
											}}
											value={editContent}
											onChange={(e) => setEditContent(e.target.value)}
										/>

										<input
											type="file"
											style={{ marginTop: 10 }}
											onChange={(e) => setEditFile(e.target.files?.[0] || null)}
										/>

										<SmartBox row gap="px4" mt="px4" justifyContent="flex-end">
											<button onClick={() => setEditingMsg(null)}>Cancelar</button>
											<button onClick={onSaveEdit}>Guardar cambios</button>
										</SmartBox>
									</Paper>
								)}

								{help.status === 'open' && <HelpResponseForm onSend={post} />}
							</>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cerrar</Button>
					</DialogActions>
				</Dialog>

				{/* Confirmación eliminar ayuda */}
				<Dialog open={confirmOpen} onClose={cancelDelete} maxWidth="xs" fullWidth>
					<DialogTitle>Eliminar ayuda</DialogTitle>
					<DialogContent dividers>
						¿Seguro que quieres eliminar esta ayuda? Esta acción no se puede deshacer.
					</DialogContent>
					<DialogActions>
						<Button onClick={cancelDelete}>Cancelar</Button>
						<Button color="error" onClick={doDelete}>Eliminar</Button>
					</DialogActions>
				</Dialog>
			</>
		);
};

export default HelpCard;

