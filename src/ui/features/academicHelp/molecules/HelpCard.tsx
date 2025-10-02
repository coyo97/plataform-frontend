import React from 'react';
import { Link } from 'react-router-dom';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/material';

import Card from '../../../shared/organisms/card/Card';
import CardActions from '../../../shared/molecules/cardActions/CardActions';

import ImagePreview from '../../../shared/atoms/filePreview/ImagePreview';
import VideoPreview from '../../../shared/atoms/filePreview/VideoPreview';
import HelpStatusBadge from '../atoms/HelpStatusBadge';
import Loader from '../../../shared/atoms/feedback/loader/Loader';
import HelpMessageCard from './HelpMessageCard';
import HelpResponseForm from '../organisms/HelpResponseForm';

import {
	fetchThread,
	postMessage,
	voteMessage,
	markSolution,
} from '../../../../async/services/academicHelpService';

import type { AcademicHelp } from '../../../../types/academicHelp';
import type { HelpThread } from '../../../../types/helpThread';

import getEnvVariables from '../../../../config/configEnvs';
const { HOST } = getEnvVariables();

/* ------------------------------------------------------------ */

const HelpCard: React.FC<{ help: AcademicHelp }> = ({ help }) => {
	const [open, setOpen] = React.useState(false);
	const [busy, setBusy] = React.useState(false);
	const [thread, setThread] = React.useState<HelpThread | null>(null);

	const avatarSrc = help.user?.profile?.profilePicture
		? `${HOST}/${help.user.profile.profilePicture}`
		: undefined;

		/* chips fijos de contexto */
		const ctx = ['Facultad', 'Carrera', 'Asignatura', 'Unidad', 'Ciclo'];

		/* cargar hilo cuando se abre */
		const loadThread = async () => {
			setBusy(true);
			const { thread } = await fetchThread(help._id);
			setThread(thread);
			setBusy(false);
		};

		const refresh = async () => {
			const { thread } = await fetchThread(help._id);
			setThread(thread);
		};

		const handleOpen = async () => {
			if (!thread) await loadThread();
			setOpen(true);
		};

		const handleClose = () => setOpen(false);

		/* acciones del hilo */
		const post = async (c: string, f?: File) => {
			await postMessage(help._id, { content: c, file: f });
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

		/* ------------ UI ------------ */
		return (
			<>
				<Card
					title={help.topic || '(Sin título)'}
					description={
						help.description
							? `${help.description.slice(0, 140)}${
								help.description.length > 140 ? '…' : ''
							}`
							: undefined
					}
					author={
						help.user
							? {
								name: help.user.username,
								avatarUrl: avatarSrc,
							}
							: undefined
					}
					date={help.created_at}
					tags={ctx}
					media={
						help.fileUrl ? (
							/\.(mp4|webm)$/i.test(help.fileUrl) ? (
								<VideoPreview src={`${HOST}/${help.fileUrl}`} type="video/mp4" />
							) : (
								<ImagePreview src={`${HOST}/${help.fileUrl}`} alt="Adjunto" />
							)
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
				/>

				{/* DIALOG DE RESPUESTAS */}
				<Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
					<DialogTitle>Respuestas de la solicitud</DialogTitle>
					<DialogContent dividers>
						{busy && <Loader size="small" />}

						{!busy &&
							(thread && thread.messages.length ? (
								thread.messages.map((m) => (
									<HelpMessageCard
										key={m._id}
										message={m}
										solved={thread.solvedMessage === m._id}
										onVote={() => vote(thread._id, m._id)}
										onSolve={() => solve(thread._id, m._id)}
									/>
								))
						) : (
							<p style={{ color: '#666' }}>Sin respuestas aún</p>
						))}

						{help.status === 'open' && <HelpResponseForm onSend={post} />}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cerrar</Button>
					</DialogActions>
				</Dialog>
			</>
		);
};

export default HelpCard;

