import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export const LoaderWrapper = styled(Box)<{ centered?: boolean }>(({ centered }) => ({
	display: 'flex',
	justifyContent: centered ? 'center' : 'flex-start',
	alignItems: centered ? 'center' : 'flex-start',
	width: '100%',
}));

