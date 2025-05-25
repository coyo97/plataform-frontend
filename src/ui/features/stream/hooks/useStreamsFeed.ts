// src/ui/features/stream/hooks/useStreamsFeed.ts
import * as api from '../../../../async/services/streamService';
import type { Stream } from '../../../../types/stream';
import { EVENTS } from '../../../../utils/socket/events';
import {
  useRealtimeFeed,
  RegisterFn,
} from '../../../shared/hooks/useRealtimeFeed';

export const useStreamsFeed = (type: 'live' | 'ended' | 'all' = 'live') => {
  const query =
    type === 'live'  ? '?live=true' :
    type === 'ended' ? '?ended=true' :
                       '';

  const register: RegisterFn<Stream> = (socket, set) => {
    socket.on(EVENTS.STREAM_CREATED, (s: Stream) => set(p => [s, ...p]));
    socket.on(EVENTS.STREAM_ENDED,   ({ streamId }) =>
      set(p => p.filter(x => x._id !== streamId)),
    );
    socket.on(EVENTS.STREAM_LIKE, ({ streamId, userId, like }) =>
      set(p =>
        p.map(x =>
          x._id === streamId
            ? {
                ...x,
                likes: like
                  ? [...x.likes, userId]
                  : x.likes.filter(id => id !== userId),
              }
            : x,
        ),
      )
    );
    socket.on(EVENTS.VIEWER_COUNT, ({ streamId, viewerCount }) =>
      set(p => p.map(x =>
        x._id === streamId ? { ...x, viewerCount } : x
      )),
    );

    return () =>
      socket
        .off(EVENTS.STREAM_CREATED)
        .off(EVENTS.STREAM_ENDED)
        .off(EVENTS.STREAM_LIKE)
        .off(EVENTS.VIEWER_COUNT);
  };

  const [streams] = useRealtimeFeed(() => api.list(query), register);

  return {
    streams,
    like:   api.like,
    unlike: api.unlike,
    create: api.create,
    stop:   api.stop,
    join:   api.join,
  };
};

