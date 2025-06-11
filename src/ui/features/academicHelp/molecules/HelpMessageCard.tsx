import React from 'react';
import SmartBox from '../../../shared/atoms/box/SmartBox';
import AvatarX from '../../../shared/atoms/avatar/AvatarX';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import { ThumbUp, CheckCircle } from '@mui/icons-material';
import Text from '../../../shared/atoms/typography/Text';
import Paper from '@mui/material/Paper';
import DateTimeInfo from '../../../shared/atoms/dateTime/DateTimeInfo';
import IconButton from '../../../shared/atoms/buttons/iconButton/IconButton';
import { Chip } from '@mui/material';

interface Props {
	message: any;           // tipa con tu DTO de message
	solved: boolean;
	onVote(): void;
	onSolve(): void;
}
const HelpMessageCard: React.FC<Props> = ({ message, solved, onVote, onSolve }) => (
	<Paper elevation={0} sx={{ p:2 }}>
		<SmartBox row gap={1} alignItems="center">
			<AvatarX src={message.author?.profilePicture} size="sm" />
			<Text size="sm" weight="bold">{message.author?.username}</Text>
			<DateTimeInfo timestamp={message.created_at} size="small" variant="compact" />
			<SmartBox  row gap="px4" alignItems="center">
				<IconButton ariaLabel="Me gusta" onClick={onVote}>
					<ThumbUp fontSize="small" />
				</IconButton>
				<Text size="sm">{message.votes}</Text>
			</SmartBox>
		</SmartBox>	
		<Text size="sm">{message.votes}</Text>
		{solved
			? <Chip icon={<CheckCircle />} label="Solución" color="success" size="small" sx={{ mt:1 }} />
			: (
				<FilledButton variant="ghost" size="small" sx={{ mt:1 }} onClick={onSolve}>
					Marcar como solución
				</FilledButton>
			)}
		<Text>{message.content}</Text>
	</Paper>
);
export default HelpMessageCard;

