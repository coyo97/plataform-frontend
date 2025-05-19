// ui/features/comments/atoms/commentField/CommentField.tsx
import React from 'react';
import { StyledTextField } from './commentField.styles';

type Props = React.ComponentProps<typeof StyledTextField>;
const CommentField: React.FC<Props> = props => <StyledTextField {...props} />;

export default CommentField;

