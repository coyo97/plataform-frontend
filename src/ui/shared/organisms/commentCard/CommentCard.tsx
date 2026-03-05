// src/ui/shared/organisms/commentCard/CommentCard.tsx
import React from 'react';
import {
	CommentRoot,
	CommentHeader,
	AuthorBlock,
	AuthorMeta,
	CommentBody,
	CommentFooter,
} from './commentCard.styles';
import { CommentCardProps } from './commentCard.types';

import AvatarX from '../../atoms/avatar/AvatarX';
import Text from '../../atoms/typography/Text';
import RichText from '../../atoms/typography/RichText';
import DateTimeInfo from '../../atoms/dateTime/DateTimeInfo';
import FilledButton from '../../atoms/buttons/filledButton/FilledButton';

import { Chip, IconButton } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CommentCard: React.FC<CommentCardProps> = ({
	// autor
	author,
	date,
	subtitle,
	showAvatar = true,

	// contenido
	content,
	children,
	maxLines,

	// solución
	solved,
	canSolve,
	onSolve,

	// votos
	votes,
	onVote,

	// acciones del dueño
	isOwner,
	onEdit,
	onDelete,

	// adjuntos / extra
	attachment,
	headerActions,
	className,
	style,
}) => {
	// contenido: string / html / nodo
	let contentNode: React.ReactNode = null;

	if (content) {
		if (typeof content === 'string') {
			const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
			if (looksLikeHtml) {
				contentNode = (
					<RichText
						as="div"
						html={content}
						sx={{ mt: 0.5 }}
					/>
				);
			} else {
				contentNode = (
					<Text
						size="md"
						sx={
							maxLines
								? {
									display: '-webkit-box',
									WebkitLineClamp: maxLines,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
								}
								: undefined
						}
					>
						{content}
					</Text>
				);
			}
		} else {
			contentNode = content;
		}
	}

	const hasVotes = typeof votes === 'number' || Boolean(onVote);
	const votesLabel =
		typeof votes === 'number'
			? votes === 0
			? 'Sin votos'
			: votes === 1
				? '1 voto'
				: `${votes} votos`
					: '';

					const showSolveSection = Boolean(canSolve || solved);

					return (
						<CommentRoot className={className} style={style}>
							{/* HEADER */}
							{(author || date || headerActions || isOwner || solved) && (
								<CommentHeader>
									{/* Autor */}
									<AuthorBlock>
										{showAvatar && author && (
											<AvatarX
												src={author.avatarUrl}
												alt={author.name}
												size="sm"
											/>
										)}

										<AuthorMeta>
											{author?.name && (
												<Text size="sm" weight="bold">
													{author.name}
												</Text>
											)}

											{subtitle && (
												<Text size="xs" >
													{subtitle}
												</Text>
											)}

											{!subtitle && date && (
												<DateTimeInfo
													timestamp={date}
													size="small"
													variant="compact"
												/>
											)}
										</AuthorMeta>
									</AuthorBlock>

									{/* Acciones header (chip solución + editar/eliminar + extra) */}
									<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
										{solved && (
											<Chip
												icon={<CheckCircleIcon />}
												label="Solución"
												color="success"
												size="small"
											/>
										)}

										{headerActions}

										{isOwner && (onEdit || onDelete) && (
											<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
												{onEdit && (
													<IconButton
														aria-label="Editar comentario"
														size="small"
														onClick={onEdit}
													>
														<EditIcon fontSize="small" />
													</IconButton>
												)}

												{onDelete && (
													<IconButton
														aria-label="Eliminar comentario"
														size="small"
														color="error"
														onClick={onDelete}
													>
														<DeleteIcon fontSize="small" />
													</IconButton>
												)}
											</div>
										)}
									</div>
								</CommentHeader>
							)}

							{/* BODY */}
							<CommentBody>
								{contentNode}
								{children}

								{attachment && (
									<div style={{ marginTop: 8 }}>
										{attachment}
									</div>
								)}
							</CommentBody>

							{/* FOOTER: solución + votos */}
							{(showSolveSection || hasVotes) && (
								<CommentFooter>
									{/* Solución */}
									<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
										{solved && canSolve && (
											<Text
												size="xs"
												sx={{
													cursor: 'pointer',
													textDecoration: 'underline',
													color: 'text.secondary',
												}}
												onClick={onSolve}
											>
												Quitar solución
											</Text>
										)}

										{!solved && canSolve && onSolve && (
											<FilledButton
												variant="ghost"
												size="small"
												onClick={onSolve}
											>
												Marcar como solución
											</FilledButton>
										)}
									</div>

									{/* Votos */}
									{hasVotes && (
										<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
											{onVote && (
												<IconButton
													aria-label="Votar comentario útil"
													size="small"
													onClick={onVote}
												>
													<ThumbUpAltIcon fontSize="small" />
												</IconButton>
											)}
											{typeof votes === 'number' && (
												<Text size="xs" sx={{ opacity: 0.8 }}>
													{votesLabel}
												</Text>
											)}
										</div>
									)}
								</CommentFooter>
							)}
						</CommentRoot>
					);
};

export default React.memo(CommentCard);

