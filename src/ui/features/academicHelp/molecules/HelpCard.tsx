// ui/features/academicHelp/molecules/HelpCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import SmartBox          from '../../../shared/atoms/box/SmartBox';
import Text              from '../../../shared/atoms/typography/Text';
import Chip              from '@mui/material/Chip';
import AvatarX           from '../../../shared/atoms/avatar/AvatarX';
import DateTimeInfo      from '../../../shared/atoms/dateTime/DateTimeInfo';
import IconButton        from '../../../shared/atoms/buttons/iconButton/IconButton';

import ChatBubbleOutline from '@mui/icons-material/ChatBubbleOutline';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp   from '@mui/icons-material/KeyboardArrowUp';

import ImagePreview   from '../../../shared/atoms/filePreview/ImagePreview';
import VideoPreview   from '../../../shared/atoms/filePreview/VideoPreview';
import HelpStatusBadge from '../atoms/HelpStatusBadge';
import Loader          from '../../../shared/atoms/feedback/loader/Loader';
import HelpMessageCard from './HelpMessageCard';
import HelpResponseForm from '../organisms/HelpResponseForm';

import {
	fetchThread, postMessage, voteMessage, markSolution,
} from '../../../../async/services/academicHelpService';

import type { AcademicHelp } from '../../../../types/academicHelp';
import type { HelpThread   } from '../../../../types/helpThread';

import getEnvVariables from '../../../../config/configEnvs';
const { HOST } = getEnvVariables();

/* ------------------------------------------------------------ */

const HelpCard:React.FC<{ help:AcademicHelp }> = ({ help }) => {
	const [open,setOpen]     = React.useState(false);
	const [busy,setBusy]     = React.useState(false);
	const [thread,setThread] = React.useState<HelpThread|null>(null);

	const avatarSrc = help.user?.profile?.profilePicture
		? `${HOST}/${help.user.profile.profilePicture}` : undefined;

		/* tipo solicitud → chip derecha */
		type Req = 'concept_question'|'need_notes'|'need_exam'|'need_assignment';
		const label:Record<Req,string> = {
			concept_question:'Pregunta',
			need_notes:'Apuntes',
			need_exam:'Examen',
			need_assignment:'Tarea',
		};
		const color:Record<Req,'info'|'success'|'warning'|'secondary'> = {
			concept_question:'info',
			need_notes:'success',
			need_exam:'warning',
			need_assignment:'secondary',
		};
		const rType  = (help as any).requestType as Req|undefined;
		const rLabel = label[rType ?? 'concept_question'];
		const rColor = color[rType ?? 'concept_question'];

		/* chips fijos de contexto */
		const ctx = ['Facultad','Carrera','Asignatura','Unidad','Ciclo'];

		/* hilo on-demand */
		const loadThread = async()=>{ setBusy(true); const { thread } = await fetchThread(help._id); setThread(thread); setBusy(false); };
		const refresh    = async()=>{ const { thread } = await fetchThread(help._id); setThread(thread); };

		const toggle = async()=>{
			if(!open && !thread) await loadThread();
			setOpen(!open);
		};

		/* acciones */
		const post   = async(c:string,f?:File)=>{ await postMessage(help._id,{content:c,file:f}); refresh(); };
		const vote   = async(tid:string,mid:string)=>{ await voteMessage(tid,mid); refresh(); };
		const solve  = async(tid:string,mid:string)=>{ await markSolution(tid,mid); refresh(); };

		const replies = thread?.messages.length ?? 0;

		/* ---------------- UI ---------------- */
		return(
			<SmartBox column gap={1} p='px12'>
				{/* ENCABEZADO -------------------------------------------------- */}
				<SmartBox row between>
					{/* izquierda: avatar + meta */}
					<SmartBox row gap={1} alignItems="center" >
						<AvatarX src={avatarSrc} size="sm"/>
						<SmartBox row gap={1}>
							<Text weight="bold">{help.user?.username ?? 'Usuario'}</Text>
							<DateTimeInfo timestamp={help.created_at} />
						</SmartBox>
					</SmartBox>

					{/* derecha: chip de tipo */}
					<Chip label={rLabel} color={rColor} size="small" sx={{fontWeight:500}}/>
				</SmartBox>

				{/* fila chips contexto */}
				<SmartBox row gap={1} flexWrap="wrap">
					{ctx.map(c=><Chip key={c} label={c} size="small" variant="outlined"/>)}
				</SmartBox>

				{/* Título */}
				<Text weight="bold" size="lg" as={Link}
					to={`/academic-help/${help._id}`}
					sx={{ textDecoration:'none', color:'inherit' }}>
					{help.topic || '(Sin título)'}
				</Text>

				{/* Descripción */}
				{help.description && (
					<Text size="sm" colorKey="neutral.black.500">
						{help.description.slice(0,140)}{help.description.length>140 && '…'}
					</Text>
				)}

				{/* Adjunto */}
				{help.fileUrl && (
					/\.(mp4|webm)$/i.test(help.fileUrl)
						? <VideoPreview src={`${HOST}/${help.fileUrl}`} type="video/mp4"/>
						: <ImagePreview src={`${HOST}/${help.fileUrl}`} alt="Adjunto"/>
				)}

				{/* Estado (abierto | resuelto) */}
				<HelpStatusBadge status={help.status}/>

				{/* FOOTER ----------------------------------------------------- */}
				<SmartBox row between center mt="px6">
					<SmartBox row gap="px4" alignItems="center">
						<ChatBubbleOutline fontSize="small"/>
						<Text size="sm">{replies}</Text>
					</SmartBox>

					<IconButton ariaLabel="Ver respuestas" onClick={toggle}>
						{open ? <KeyboardArrowUp fontSize="small"/> : <KeyboardArrowDown fontSize="small"/>}
					</IconButton>
				</SmartBox>

				{/* PANEL DESPLEGABLE ----------------------------------------- */}
				{open && (
					<SmartBox column gap="px6" mt="px6">
						{busy && <Loader size="small"/>}

						{!busy && (
							thread && thread.messages.length
								? thread.messages.map(m=>(
									<HelpMessageCard
										key={m._id}
										message={m}
										solved={thread.solvedMessage===m._id}
										onVote ={()=>vote (thread._id,m._id)}
										onSolve={()=>solve(thread._id,m._id)}
									/>
								))
								: <Text size="sm" colorKey="neutral.black.400">Sin respuestas aún</Text>
						)}

						{help.status==='open' && <HelpResponseForm onSend={post}/>}
					</SmartBox>
				)}
			</SmartBox>
		);
};

export default HelpCard;

