import React from 'react';
import CommentIconBase from '@mui/icons-material/Comment';
import { IconProps }   from './icons.types';
import { sizeMap }     from './icons.helpers';

const CommentIcon: React.FC<IconProps> = ({
  size='sm', ...rest
}) =>
  <CommentIconBase fontSize={sizeMap[size]} {...rest} />;

export default CommentIcon;

