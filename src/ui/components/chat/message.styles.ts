import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const MesgsContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '10px',
    overflowY: 'auto',
    [mq('sm', 'min')]: {
        padding: '20px',
    },
});

export const MsgHistory = styled('div')({
    flex: '1',
    overflowY: 'auto',
    marginBottom: '20px',
    [mq('md', 'min')]: {
        padding: '10px',
    },
});

export const MessageInputForm = styled('form')({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 'auto',
    padding: '10px 0',
});

export const MessageInput = styled('input')(({ theme }) => ({
    flex: '1',
    padding: '10px',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '5px',
    marginRight: '10px',
    [mq('xs', 'min')]: {
        padding: '15px',
    },
}));

export const SendButton = styled('button')(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    [mq('xs', 'min')]: {
        padding: '12px 18px',
    },
}));

