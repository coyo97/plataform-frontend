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
import HelpStatusBadge from '../atoms/HelpStatusBadge';
import Loader from '../../../shared/atoms/feedback/loader/Loader';
import HelpMessageCard from './HelpMessageCard';
import HelpResponseForm from '../organisms/HelpResponseForm';
import RenderFile from '../../../shared/organisms/renderFile/RenderFile';
import { useSearchParams } from 'react-router-dom';

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

const HelpCard: React.FC<{ help: AcademicHelp }> = ({ help }) => {
	const [open, setOpen] = React.useState(false);
	const [busy, setBusy] = React.useState(false);
	const [thread, setThread] = React.useState<HelpThread | null>(null);

	const avatarSrc = help.user?.profile?.profilePicture
		? `${HOST}/${help.user.profile.profilePicture}`
		: undefined;

		// Construye tags contextuales con lo que haya (IDs poblados o campos legacy)
		const tags: string[] = [];
		const facName    = (help as any)?.facultyId?.name || (help as any)?.faculty;
		const careerName = (help as any)?.careerId?.name;
		const subjectName= (help as any)?.subjectId?.name || (help as any)?.subject;
		const unitName   = (help as any)?.unitId?.name;
		const cycleName  = (help as any)?.cycleId?.name || (help as any)?.semester;

		if (facName)    tags.push(`Facultad: ${facName}`);
		if (careerName) tags.push(`Carrera: ${careerName}`);
		if (subjectName)tags.push(`Asignatura: ${subjectName}`);
		if (unitName)   tags.push(`Unidad: ${unitName}`);
		if (cycleName)  tags.push(`Ciclo: ${cycleName}`);

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

		const handleClose = () => setOpen(false);

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
			if (typeof maybe === 'string') return maybe;       // ObjectId como string
			if (typeof maybe === 'object' && maybe._id) return String(maybe._id);
			return undefined;
		};

		const handleTagClick = (txt: string) => {
			// "Asignatura: Cálculo I", "Carrera: Sistemas", etc.
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
				else    next.set('subject', value); // legacy fallback
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

