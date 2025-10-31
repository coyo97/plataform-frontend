// src/ui/features/stream/organisms/StreamActiveLayout.tsx
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import StreamPlayer from '../organisms/streamPlayer/StreamPlayer';
import StreamList from '../organisms/StreamList';
import SectionTitle from '../../../shared/atoms/titles/SectionTitle';
import ChatPanel from './ChatPanel';
import { useSocket } from '../../../shared/hooks/useSocket';
import { Stream } from '../../../../types/stream';

interface Props {
  streamId: string;
  isStreamer: boolean;
  accessCode?: string;
  onStreamEnd: () => void;
  stream?: Stream;
}

const StreamActiveLayout: React.FC<Props> = ({
  streamId,
  isStreamer,
  accessCode,
  onStreamEnd,
  stream,
}) => {
  const theme = useTheme();
  const socket = useSocket();
  const [viewers, setViewers] = useState<{ _id: string; username: string }[]>([]);

  /* Recibe lista actualizada del backend */
  useEffect(() => {
    const handler = ({ viewers }: { viewers: { _id: string; username: string }[] }) =>
      setViewers(viewers);

    socket.on('update-viewers', handler);
    socket.on('viewer-list', handler);

    return () => {
      socket.off('update-viewers', handler);
      socket.off('viewer-list', handler);
    };
  }, [socket]);

  return (
    <Grid container spacing={theme.padding.px6}>
      {/* reproductor */}
      <Grid item xs={12} md={8}>
        <StreamPlayer
          streamId={streamId}
          isStreamer={isStreamer}
          accessCode={accessCode}
          onStreamEnd={onStreamEnd}
          stream={stream}
        />
      </Grid>

      {/* columna derecha */}
      <Grid item xs={12} md={4} sx={{ display:'flex', flexDirection:'column', gap:theme.padding.px6 }}>
        <ChatPanel streamId={streamId} viewers={viewers} />

        <Box>
          <SectionTitle>Streams activos</SectionTitle>
          {/* 👇 importante: forzamos 'live' */}
          <StreamList dense type="live" />
        </Box>
      </Grid>
    </Grid>
  );
};

export default StreamActiveLayout;
