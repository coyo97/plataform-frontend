// ui/features/academicHelp/organisms/HelpThreadViewer.tsx
import React from 'react';
import Paper from '@mui/material/Paper';
import Chip  from '@mui/material/Chip';

import SmartBox       from '../../../shared/atoms/box/SmartBox';
import Text           from '../../../shared/atoms/typography/Text';
import Loader         from '../../../shared/atoms/feedback/loader/Loader';
import AvatarX        from '../../../shared/atoms/avatar/AvatarX';
import DateTimeInfo   from '../../../shared/atoms/dateTime/DateTimeInfo';
import ImagePreview   from '../../../shared/atoms/filePreview/ImagePreview';
import VideoPreview   from '../../../shared/atoms/filePreview/VideoPreview';

import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import PeopleOutline     from '@mui/icons-material/PeopleOutline';
import ShareIcon         from '@mui/icons-material/Share';

import HelpStatusBadge   from '../atoms/HelpStatusBadge';
import HelpMessageCard   from '../molecules/HelpMessageCard';
import HelpResponseForm  from './HelpResponseForm';
import { useHelpThread } from '../hook/useHelpThread';

import type { HelpMessage } from '../../../../types/helpThread';
import getEnvVariables from '../../../../config/configEnvs';

import {
	updateMessage,
	deleteMessage
} from '../../../../async/services/academicHelpService';

// 🔁 imports nuevos para mensajes centralizados
import ModerationAlert from '../../../shared/molecules/moderation/ModerationAlert';
import { resolveErrorMessage } from '../../../shared/utils/validation/moderationError';

const { HOST } = getEnvVariables();

const HelpThreadViewer: React.FC<{ helpId: string }> = ({ helpId }) => {
	const { help, thread, loading, vote, solve, post, reload } = useHelpThread(helpId);

	const [editing, setEditing] = React.useState<any>(null);
	const [newContent, setNewContent] = React.useState('');
	const [newFile, setNewFile] = React.useState<File | null>(null);

	// 🔁 estado para errores globales del hilo (moderación, tipo de archivo, etc.)
	const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
	const [savingEdit, setSavingEdit] = React.useState(false);

	if (loading || !help) return <Loader />;

	const onEditMessage = (msg: any) => {
		setEditing(msg);
		setNewContent(msg.content || '');
		setNewFile(null);
	};

	const onDeleteMessageHandler = async (msg: any) => {
		if (!window.confirm('¿Eliminar este mensaje?')) return;

		try {
			await deleteMessage(helpId, msg._id);
			setEditing(null);
			await reload();
		} catch (err) {
			console.error('Error al eliminar mensaje de ayuda:', err);
			const userMsg = resolveErrorMessage(err, {
				generic   : 'No se pudo eliminar el mensaje. Inténtalo nuevamente.',
				// en delete casi nunca habrá moderación, pero dejamos el hook preparado
				moderation: 'No se pudo eliminar el mensaje debido a una restricción del sistema.',
			});
			setErrorMsg(userMsg);
		}
	};

	const onSaveEdit = async () => {
		if (!editing) return;

		const fd = new FormData();
		fd.append('content', newContent);

		if (newFile) {
			fd.append('file', newFile);
		} else {
			// si no hay nuevo archivo, eliminamos cualquier adjunto que hubiera
			fd.append('removeAttachment', 'true');
		}

		try {
			setSavingEdit(true);
			setErrorMsg(null);

			await updateMessage(helpId, editing._id, fd);
			setEditing(null);
			await reload();
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

	// 🔁 wrapper para enviar nuevas respuestas (texto + archivo) con manejo de IA
	const handleSendResponse = async (...args: any[]) => {
		try {
			setErrorMsg(null);
			// post puede recibir (content, file) u otro payload, lo respetamos
			await (post as any)(...args);
		} catch (err) {
			console.error('Error al enviar respuesta en hilo de ayuda:', err);

			const userMsg = resolveErrorMessage(err, {
				generic   : 'No se pudo enviar la respuesta. Inténtalo nuevamente.',
				moderation: 'La respuesta fue bloqueada por moderación. Revisa que el texto y el archivo adjunto cumplan las políticas.',
				fileType  : 'Tipo de archivo no permitido en las respuestas. Revisa las extensiones soportadas.',
				fileSize  : 'El archivo que intentas adjuntar en la respuesta es demasiado grande.',
			});

			setErrorMsg(userMsg);
		}
	};

	/* -------- helpers -------- */
	const avatarSrc = help.user?.profile?.profilePicture
		? `${HOST}/${help.user.profile.profilePicture}`
		: undefined;

	type ReqType = 'concept_question'|'need_notes'|'need_exam'|'need_assignment';
	const reqColor:Record<ReqType,string>={
		concept_question:'primary',
		need_notes:'success',
		need_exam:'warning',
		need_assignment:'secondary'
	};
	const rType = (help as any).requestType as ReqType|undefined;
	const typeColor = reqColor[rType ?? 'concept_question'];

	const ctxChips:string[]=[];
	if((help as any).facultyId) ctxChips.push('Facultad');
	if((help as any).careerId)  ctxChips.push('Carrera');
	if((help as any).subjectId) ctxChips.push('Asignatura');
	if((help as any).unitId)    ctxChips.push('Unidad');
	if((help as any).cycleId)   ctxChips.push('Ciclo');

	/* -------- UI -------- */
	return (
		<SmartBox column gap={3}>
			{/* 🔁 alerta global para errores de moderación / archivo en el hilo */}
			<ModerationAlert
				message={errorMsg}
				onClose={() => setErrorMsg(null)}
			/>

			{/* BLOQUE PRINCIPAL ------------------------------------ */}
			<Paper elevation={1} sx={{ p: 3 }}>
				{/* Encabezado: autor + tipo + fecha */}
				<SmartBox row between>
					<SmartBox row gap="px4" alignItems="center">
						<AvatarX src={avatarSrc} size="sm" />
						<SmartBox column>
							<Text weight="bold">{help.user?.username ?? 'Usuario'}</Text>
							<DateTimeInfo timestamp={help.created_at} size="small" />
						</SmartBox>
					</SmartBox>

					<Chip
						label={(help as any).requestType?.replace('_', ' ') ?? 'Solicitud'}
						size="small"
						sx={{ fontWeight: 500 }}
						color={typeColor as any}
					/>
				</SmartBox>

				{/* Chips de contexto */}
				<SmartBox row gap="px4" ml="px6" mb="px4">
					{ctxChips.map(label => (
						<Chip key={label} label={label} size="small" variant="outlined" />
					))}
				</SmartBox>

				<HelpStatusBadge status={help.status} />

				{/* Título y descripción */}
				<Text weight="bold" size="xl">
					{help.topic || '(Sin título)'}
				</Text>

				{help.description && <Text>{help.description}</Text>}

				{/* Archivo adjunto de la solicitud principal */}
				{help.fileUrl && (
					help.fileUrl.match(/\.(mp4|webm)$/i)
						? <VideoPreview src={`${HOST}/${help.fileUrl}`} type="video/mp4" />
						: <ImagePreview src={`${HOST}/${help.fileUrl}`} alt="Adjunto" />
				)}

				{/* Pie de acciones */}
				<SmartBox row gap="px6" mt="px6" alignItems="center">
					<ChatBubbleOutline fontSize="small" />
					<Text size="sm">{thread?.messages.length ?? 0}</Text>

					<PeopleOutline fontSize="small" />
					<Text size="sm">{thread?.messages.length ?? 0}</Text>

					<ShareIcon fontSize="small" sx={{ ml: 'auto', cursor: 'pointer' }} />
				</SmartBox>
			</Paper>

			{/* RESPUESTAS ------------------------------------------ */}
			<Text weight="bold" size="md">Respuestas</Text>

			<SmartBox column gap={2}>
				{thread?.messages.map((m: HelpMessage) => (
					<HelpMessageCard
						key={m._id}
						message={m}
						solved={thread.solvedMessage === m._id}
						onVote={() => vote(thread._id, m._id)}
						onSolve={() => solve(thread._id, m._id)}
						onEdit={onEditMessage}
						onDelete={onDeleteMessageHandler}
					/>
				))}
			</SmartBox>

			{/* FORMULARIO NUEVA RESPUESTA -------------------------- */}
			{help.status === 'open' && (
				<HelpResponseForm onSend={handleSendResponse} />
			)}

			{editing && (
				<Paper
					elevation={4}
					sx={{
						position: 'fixed',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 'min(420px, 90vw)',
						p: 3,
						zIndex: 1300,
					}}
				>
					<Text weight="bold" size="md">
						Editar respuesta
					</Text>

					<textarea
						style={{
							width: '100%',
							marginTop: 8,
							minHeight: 80,
							resize: 'vertical',
						}}
						value={newContent}
						onChange={(e) => setNewContent(e.target.value)}
					/>

					<input
						type="file"
						style={{ marginTop: 10 }}
						onChange={(e) => setNewFile(e.target.files?.[0] || null)}
					/>

					<SmartBox row gap="px4" mt="px4" justifyContent="flex-end">
						<button onClick={() => setEditing(null)} disabled={savingEdit}>
							Cancelar
						</button>
						<button onClick={onSaveEdit} disabled={savingEdit}>
							{savingEdit ? 'Guardando…' : 'Guardar cambios'}
						</button>
					</SmartBox>
				</Paper>
			)}
		</SmartBox>
	);
};

export default HelpThreadViewer;

