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


const { HOST } = getEnvVariables();

/* ------------------------------------------------------------ */

const HelpThreadViewer: React.FC<{ helpId: string }> = ({ helpId }) => {
	const { help, thread, loading, vote, solve, post } = useHelpThread(helpId);
	if (loading || !help) return <Loader />;

	/* -------- helpers -------- */
	const avatarSrc = help.user?.profile?.profilePicture
		? `${HOST}/${help.user.profile.profilePicture}`
		: undefined;

		// …imports sin cambios …

		// dentro del componente (después de avatarSrc)
		type ReqType = 'concept_question'|'need_notes'|'need_exam'|'need_assignment';
		const reqColor:Record<ReqType,string>={
			concept_question:'primary',
		need_notes:'success',
		need_exam:'warning',
		need_assignment:'secondary'
		};
		const rType = (help as any).requestType as ReqType|undefined;
		const typeColor = reqColor[rType??'concept_question'];

		const ctxChips:string[]=[];
		if((help as any).facultyId) ctxChips.push('Facultad');
		if((help as any).careerId)  ctxChips.push('Carrera');
		if((help as any).subjectId) ctxChips.push('Asignatura');
		if((help as any).unitId)    ctxChips.push('Unidad');
		if((help as any).cycleId)   ctxChips.push('Ciclo');

		/* -------- UI -------- */
		return (
			<SmartBox column gap={3}>
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
						/>
					</SmartBox>

					{/* Chips de contexto */}
					<SmartBox row gap="px4"  ml='px6' mb="px4">
						{ctxChips.map(label => (
							<Chip key={label} label={label} size="small" variant="outlined" />
						))}
					</SmartBox>

					<HelpStatusBadge status={help.status} />

					{/* Título y descripción */}
					<Text weight="bold" size="xl" >
						{help.topic || '(Sin título)'}
					</Text>

					{help.description && (
						<Text >{help.description}</Text>
					)}

					{/* Archivo adjunto */}
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
						/>
					))}
				</SmartBox>

				{/* FORMULARIO NUEVA RESPUESTA -------------------------- */}
				{help.status === 'open' && <HelpResponseForm onSend={post} />}
			</SmartBox>
		);
};

export default HelpThreadViewer;

