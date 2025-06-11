// src/ui/shared/hooks/useMessages.ts

import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../../providers/SocketProvider';
import {
  fetchMessages,
  registerMessageEvents,
} from '../../../../async/services/messageService';
import { Message } from '../../../../types/types';

export function useMessages(chatId: string, isGroup: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore]   = useState(true);
  const [loading, setLoading]   = useState(false);

  const socket    = useSocket();
  const chatIdRef = useRef(chatId);

  /* Reinicia al cambiar chat */
  useEffect(() => {
    chatIdRef.current = chatId;
    setMessages([]);
    setHasMore(true);
    load(true);
  }, [chatId, isGroup]);

  /* Socket listeners */
  useEffect(
    () => registerMessageEvents(socket, setMessages, chatIdRef),
    [socket],
  );

  const load = async (initial = false) => {
    if (!chatId || loading || !hasMore) return;
    setLoading(true);

    const skip  = initial ? 0 : messages.length;
    const limit = 10;

    try {
      const { messages: batch } = await fetchMessages(chatId, isGroup, skip, limit);
      if (batch.length < limit) setHasMore(false);
      setMessages(prev => [...batch, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, setMessages, loadMore: () => load(false), hasMore };
}

