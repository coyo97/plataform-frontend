import React from 'react';
import { PostContainer,MainContainer, PostContent, UserAvatar, PostImage, RatingSection, CommentButton } from './postList.styles';
import { Typography, Box } from '@mui/material';

const PostList: React.FC = () => {
    return (
        <Box>
            <MainContainer>
                <UserAvatar src="/path/to/avatar.png" alt="Usuario" />
                <PostContent>
                    <Typography variant="subtitle2">Mario Coyo Layme</Typography>
                    <Typography variant="body2" color="primary">Matemáticas: ayúdame, ¿me podrían decir si está bien?</Typography>
                    <Typography variant="caption">Tipo: Imagen</Typography>
                    <PostImage src="/path/to/post-image.png" alt="Imagen de publicación" />
                    <RatingSection>
                        <Typography variant="caption">Valoración:</Typography>
                    </RatingSection>
                    <CommentButton>
                        <Typography variant="caption">Comentar</Typography>
                    </CommentButton>
                </PostContent>
            </MainContainer>

            {/* Repite más elementos de PostContainer para otras publicaciones */}
        </Box>
    );
};

export default PostList;

