import React from 'react';
import FavoriteIcon       from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconProps }      from './icons.types';
import { sizeMap }        from './icons.helpers';
import { iconSizes } from '../../../../Theme/tokens/icons';

const LikeIcon: React.FC<IconProps> = ({
	size='sm', filled=true, ...rest
}) =>
	filled
		? <FavoriteIcon
			fontSize="inherit"
			sx={{ fontSize: iconSizes[size] }}
			{...rest}
		/> 
			: <FavoriteBorderIcon fontSize={sizeMap[size]} {...rest} />;

			export default LikeIcon;

