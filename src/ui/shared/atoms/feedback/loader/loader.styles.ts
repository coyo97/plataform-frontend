import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { shouldForwardProp } from '@mui/system';

export const LoaderWrapper = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'centered',
})<{ centered?: boolean }>(({ centered }) => ({
	display: 'flex',
	justifyContent: centered ? 'center' : 'flex-start',
	alignItems: centered ? 'center' : 'flex-start',
	width: '100%',
}));

