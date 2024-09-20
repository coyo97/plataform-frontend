import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const IncomingMsgContainer = styled('div')({
    display: 'flex',
    marginBottom: '10px',
    [mq('sm', 'min')]: {
        marginBottom: '15px',
    },
});

export const IncomingMsgImg = styled('div')({
    marginRight: '10px',
    img: {
        width: '50px',
        height: '50px',
        objectFit: 'cover',
        borderRadius: '50%',
    },
    [mq('sm', 'min')]: {
        img: {
            width: '60px',
            height: '60px',
        },
    },
});

export const ReceivedMsg = styled('div')({
    backgroundColor: '#f1f0f0',
    padding: '10px 15px',
    borderRadius: '10px',
    maxWidth: '70%',
    wordWrap: 'break-word',
    [mq('sm', 'min')]: {
        padding: '15px 20px',
        maxWidth: '80%',
    },
});

export const TimeDate = styled('span')({
    display: 'block',
    marginTop: '5px',
    fontSize: '12px',
    color: '#999',
    [mq('sm', 'min')]: {
        fontSize: '14px',
    },
});

