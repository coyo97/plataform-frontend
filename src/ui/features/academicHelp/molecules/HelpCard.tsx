// ui/features/academicHelp/molecules/HelpCard.tsx
import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
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
import { useSearchParams } from 'react-router-dom';
import RichText from '../../../shared/atoms/typography/RichText';

import FileButton from '../../../shared/atoms/buttons/fileButton/FileButton';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import TextEditor from '../../../shared/atoms/inputs/TextEditor';

import ModerationAlert from '../../../shared/molecules/moderation/ModerationAlert';
import { resolveErrorMessage } from '../../../shared/utils/validation/moderationError';

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
	const [savingEdit, setSavingEdit] = React.useState(false);

	const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

	const uid = getUserId();

	const helpUser: any = (help as any).user;
	const helpOwnerId =
		typeof helpUser === 'string'
			? helpUser
			: helpUser?._id ?? helpUser?.id ?? helpUser?.userId ?? null;

			const isOwner =
				Boolean(uid) && Boolean(helpOwnerId) && String(uid) === String(helpOwnerId);

			const avatarSrc = help.user?.profile?.profilePicture
				? `${HOST}/${help.user.profile.profilePicture}`
				: undefined;

				const tags: string[] = [];
				const facName = (help as any)?.facultyId?.name || (help as any)?.faculty;
				const careerName = (help as any)?.careerId?.name;
				const subjectName = (help as any)?.subjectId?.name || (help as any)?.subject;
				const unitName = (help as any)?.unitId?.name;
				const cycleName = (help as any)?.cycleId?.name || (help as any)?.semester;

				if (facName) tags.push(`Facultad: ${facName}`);
				if (careerName) tags.push(`Carrera: ${careerName}`);
				if (subjectName) tags.push(`Asignatura: ${subjectName}`);
				if (unitName) tags.push(`Unidad: ${unitName}`);
				if (cycleName) tags.push(`Ciclo: ${cycleName}`);

				const requestTypeLabel = (() => {
					const rt = (help as any).requestType;
					switch (rt) {
						case 'concept_question':
							return 'Pregunta';
						case 'need_notes':
							return 'Apuntes';
						case 'need_exam':
							return 'Examen';
						case 'need_assignment':
							return 'Tarea';
						default:
							return undefined;
					}
				})();

				const guessMime = (path: string): string => {
					const clean = path.split('?')[0].toLowerCase();
					if (/\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(clean)) return 'image/*';
					if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(clean)) return 'video/*';
					if (/\.(pdf)$/i.test(clean)) return 'application/pdf';
					return 'application/octet-stream';
				};

				const initialReplies =
					(help as any).messagesCount ??
					(help as any).repliesCount ??
					(help as any).commentsCount ??
					0;

				const [repliesCount, setRepliesCount] = React.useState(initialReplies);

				const loadThread = async () => {
					setBusy(true);
					const { thread } = await fetchThread(help._id as any);
					setThread(thread);
					setRepliesCount(thread?.messages?.length ?? 0);
					setBusy(false);
				};

				const refresh = async () => {
					const { thread } = await fetchThread(help._id as any);
					setThread(thread);
					setRepliesCount(thread?.messages?.length ?? 0);
				};

				const handleOpen = async () => {
					if (!thread) await loadThread();
					setOpen(true);
				};

				const handleClose = () => {
					setOpen(false);
					setEditingMsg(null);
					setEditFile(null);
					setErrorMsg(null);
				};

				const post = async (c: string, f?: File) => {
					await postMessage(help._id as any, { content: c, file: f });
					await refresh();
				};

				const vote = async (tid: string, mid: string) => {
					await voteMessage(tid, mid);
					await refresh();
				};

				const solve = async (tid: string, mid: string) => {
					await markSolution(tid, mid);
					await refresh();
				};

				const [searchParams, setSearchParams] = useSearchParams();

				const idOr = (maybe: any): string | undefined => {
					if (!maybe) return undefined;
					if (typeof maybe === 'string') return maybe;
					if (maybe?._id) return String(maybe._id);
					return undefined;
				};

				const handleTagClick = (txt: string) => {
					const [label, ...rest] = txt.split(':');
					const value = rest.join(':').trim();

					const next = new URLSearchParams(searchParams);
					['facultyId', 'careerId', 'subjectId', 'unitId', 'cycleId', 'subject'].forEach(
						(k) => next.delete(k),
					);

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
						else next.set('subject', value);
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
				const openMenu = () => setMenuOpen(true);
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
					setErrorMsg(null);
				};

				const onDeleteMessageHandler = async (msg: any) => {
					if (!window.confirm('¿Eliminar este mensaje?')) return;

					try {
						setErrorMsg(null);
						await deleteMessage(help._id as any, msg._id);
						await refresh();
						setEditingMsg(null);
						setEditFile(null);
					} catch (err) {
						console.error('Error al eliminar mensaje de ayuda:', err);
						const userMsg = resolveErrorMessage(err, {
							generic   : 'No se pudo eliminar el mensaje. Inténtalo nuevamente.',
							moderation: 'No se pudo eliminar el mensaje debido a una restricción del sistema.',
						});
						setErrorMsg(userMsg);
					}
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

					try {
						setSavingEdit(true);
						setErrorMsg(null);

						await updateMessage(help._id as any, editingMsg._id, fd);
						setEditingMsg(null);
						setEditFile(null);
						await refresh();
					} catch (err) {
						console.error('Error al actualizar mensaje de ayuda:', err);

						const userMsg = resolveErrorMessage(err, {
							generic   : 'No se pudo actualizar el mensaje. Inténtalo nuevamente.',
							moderation: 'El mensaje fue bloqueado por moderación. Revisa el texto y el archivo adjunto.',
							fileType  : 'Tipo de archivo no permitido para el mensaje. Revisa las extensiones soportadas.',
							fileSize  : 'El archivo que intentas subir es demasiado grande para este mensaje.',
						});

						setErrorMsg(userMsg);
					} finally {
						setSavingEdit(false);
					}
				};

				return (
					<>
						<Card
							title={help.topic || '(Sin título)'}
							description={
								help.description ? <RichText as="div" html={help.description} /> : undefined
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
										buttonLabels={{
											viewPdf: 'Ver PDF',
											download: 'Descargar archivo',
										}}
									/>
							) : null
							}
							footer={
								<SmartBox row gap="px8" alignItems="center">
									<HelpStatusBadge status={help.status} />
									{requestTypeLabel && (
										<Text size="xs" sx={{ color: 'text.secondary' }}>
											· Tipo: {requestTypeLabel}
										</Text>
									)}
									{(help as any).votesCount > 0 && (
										<Text size="xs" sx={{ color: 'text.secondary' }}>
											· {(help as any).votesCount} votos en las respuestas
										</Text>
									)}
								</SmartBox>
							}
							actions={
								<CardActions
									commentsCount={repliesCount}
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
										{/* 🔁 alerta de moderación / archivo dentro del diálogo */}
										<ModerationAlert
											message={errorMsg}
											onClose={() => setErrorMsg(null)}
										/>

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
													canSolve={isOwner}
												/>
											))
										) : (
											<p style={{ color: '#666' }}>Sin respuestas aún</p>
										)}

										{editingMsg && (
											<Paper
												elevation={1}
												sx={{
													mt: 2,
													p: 2,
													borderRadius: 2,
													border: '1px solid',
													borderColor: 'divider',
												}}
											>
												<Text weight="bold" size="sm" sx={{ mb: 1 }}>
													Editar respuesta
												</Text>

												<TextEditor
													label="Contenido de la respuesta"
													placeholder="Edita tu respuesta…"
													value={editContent}
													onChange={(val) => setEditContent(val)}
													minHeight={100}
													toolbarOptions={{
														bold: true,
														italic: true,
														underline: true,
														bulletList: true,
														orderedList: true,
													}}
												/>

												<SmartBox row gap="px4" mt="px4" alignItems="center">
													<FileButton
														onChange={(e) => setEditFile(e.target.files?.[0] || null)}
													/>
													{editingMsg.attachments?.length > 0 && !editFile && (
														<Text size="xs" sx={{ color: 'text.secondary' }}>
															Si guardas sin seleccionar archivo, se eliminará el adjunto
															anterior.
														</Text>
													)}
												</SmartBox>

												<SmartBox row gap="px4" mt="px4" justifyContent="flex-end">
													<FilledButton
														variant="ghost"
														size="small"
														onClick={() => {
															setEditingMsg(null);
															setEditFile(null);
															setErrorMsg(null);
														}}
														disabled={savingEdit}
													>
														Cancelar
													</FilledButton>

													<FilledButton
														colorType="primary"
														size="small"
														onClick={onSaveEdit}
														disabled={savingEdit || !editContent.trim()}
													>
														{savingEdit ? 'Guardando…' : 'Guardar cambios'}
													</FilledButton>
												</SmartBox>
											</Paper>
										)}

										{/* Formulario NUEVA RESPUESTA (usa HelpResponseForm con su propio alert interno) */}
										{help.status === 'open' && !editingMsg && (
											<HelpResponseForm onSend={post} />
										)}

										{help.status === 'resolved' && (
											<Text size="xs" sx={{ color: 'text.secondary', mt: 2 }}>
												Esta ayuda ya tiene una solución marcada.
											</Text>
										)}
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
								¿Seguro que quieres eliminar esta ayuda? Esta acción no se puede
								deshacer.
							</DialogContent>
							<DialogActions>
								<Button onClick={cancelDelete}>Cancelar</Button>
								<Button color="error" onClick={doDelete}>
									Eliminar
								</Button>
							</DialogActions>
						</Dialog>
					</>
				);
};

export default HelpCard;

