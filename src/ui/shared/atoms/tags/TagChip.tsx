// ui/atoms/TagChip/TagChip.tsx
import { styled } from '@mui/material/styles';
import { Chip }   from '@mui/material';

const TagChip = styled(Chip)(({ theme }) => ({
	marginRight: theme.spacing(0.5),
	marginTop  : theme.spacing(1),
}));

export default TagChip;

