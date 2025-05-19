// ui/features/comments/organisms/CommentList/CommentList.tsx
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Wrapper } from './commentList.styles';
import CommentCard from '../../molecules/CommentCard/CommentCard';
import CommentDialog from '../CommentDialog/CommentDialog';
import { useCommentsFeed } from '../../hooks/useCommentsFeed';
import { Comment } from '../../../../../types/comment';
import CommentModal from '../../molecules/commentModal/CommentModal';

interface Props { publicationId: string }

const CommentList:React.FC<Props> = ({ publicationId })=>{
	const { comments, create, edit, del } = useCommentsFeed(publicationId);
	const uid = localStorage.getItem('userId');

	/* modal control */
	const [editing,setEditing] = useState<Comment|null>(null);
	const [adding ,setAdding ] = useState(false);

	const openAdd   = ()=> setAdding(true);
	const openEdit  = (c:Comment)=> setEditing(c);
	const closeAll  = ()=> { setAdding(false); setEditing(null); };

	return (
		<>
			<Box sx={{px:2,pt:2,display:'flex',alignItems:'center',gap:1}}>
				<Typography variant="h6" sx={{flex:1}}>Comentarios</Typography>
				<Button size="small" startIcon={<AddIcon/>} onClick={openAdd}>
					Añadir
				</Button>
			</Box>

			<Wrapper>
				{comments.length ? comments.map(c=>(
					<CommentCard key={c._id}
						data={c}
						canEdit={c.author._id===uid}
						onEdit ={()=>openEdit(c)}
						onDelete={()=>del(c._id)}
					/>
				)):(
					<Box sx={{px:2,py:1}}><Typography>No hay comentarios aún.</Typography></Box>
				)}
			</Wrapper>

			{/* dialogs */}
			{adding && (
				<CommentModal
					open
					title="Nuevo comentario"
					onClose={closeAll}
					onSave={async text => {       // wrapper ▶️ Promise<void>
						await create(text);         // ⬅︎ si quieres, maneja toast/alert aquí
					}}
				/>
			)}
			{editing && (
				<CommentModal
					open
					title="Editar comentario"
					initial={editing.content}
					onClose={closeAll}
					onSave={async text => {       // wrapper ▶️ Promise<void>
						if (editing) await edit(editing._id, text);
					}}
				/>
			)}
		</>
	);
};

export default CommentList;

