import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const SectionTitle = styled(Typography)(({ theme }) => ({
	fontWeight: 600,
	marginBottom: theme.spacing(2),
}));

export default SectionTitle;

