// ui/features/academicHelp/hook/useHelpThread.ts
import { useEffect, useState } from 'react';
import {
  fetchHelpById,
  fetchThread,
  postMessage,
  voteMessage,
  markSolution,
} from '../../../../async/services/academicHelpService';
import { AcademicHelp } from '../../../../types/academicHelp';
import { HelpThread, HelpMessage } from '../../../../types/helpThread';

export const useHelpThread = (helpId: string) => {
  const [help, setHelp] = useState<AcademicHelp | null>(null);
  const [thread, setThread] = useState<HelpThread | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [h, { thread: t }] = await Promise.all([
      fetchHelpById(helpId),
      fetchThread(helpId),
    ]);
    setHelp(h);
    setThread(t);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [helpId]);

  const vote = async (tid: string, mid: string) => {
    try {
      const { votes } = await voteMessage(tid, mid);

      setThread((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map((m: HelpMessage) =>
            m._id === mid ? { ...m, votes } : m
          ),
        };
      });
    } catch (err) {
      console.error('Error al votar mensaje de ayuda:', err);
    }
  };

  const solve = async (tid: string, mid: string) => {
    await markSolution(tid, mid);
    await load();
  };

  const post = async (content: string, _file?: File) => {
    await postMessage(helpId, { content });
    await load();
  };

  const reload = () => load();

  return { help, thread, loading, vote, solve, post, reload };
};

