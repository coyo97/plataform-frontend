import { styled } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';

export const StyledAlert = styled(MuiAlert)(({ theme }) => ({
	borderRadius: theme.radius?.sm3x ?? 6,
	fontSize: theme.typography.pxToRem(14),
}));

