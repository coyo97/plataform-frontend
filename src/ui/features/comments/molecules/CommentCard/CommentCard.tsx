// ui/features/comments/molecules/CommentCard/CommentCard.tsx
import React from 'react';
import { IconButton, Typography } from '@mui/material';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card } from './commentCard.styles';
import { Comment } from '../../../../../types/comment';

interface Props {
	data : Comment;
	canEdit : boolean;
	onEdit  : () => void;
	onDelete: () => void;
}

const CommentCard: React.FC<Props> = ({ data, canEdit, onEdit, onDelete }) => (
	<Card>
		{/* contenido */}
		<div>
			<Typography fontWeight={600} color="secondary">
				{data.author.username}
			</Typography>
			<Typography variant="body2" sx={{ mt: .5 }}>
				{data.content}
			</Typography>
			<Typography variant="caption" color="text.secondary">
				{new Date(data.created_at).toLocaleString()}
			</Typography>
		</div>

		{/* acciones */}
		{canEdit && (
			<div>
				<IconButton size="small" onClick={onEdit}><EditIcon fontSize="small"/></IconButton>
				<IconButton size="small" onClick={onDelete}><DeleteIcon fontSize="small"/></IconButton>
			</div>
		)}
	</Card>
);

export default CommentCard;

