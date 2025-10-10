import { useEffect, useState } from 'react';
import {
	fetchHelpById, fetchThread, postMessage,
	voteMessage, markSolution
} from '../../../../async/services/academicHelpService';
import { AcademicHelp } from '../../../../types/academicHelp';
import { HelpThread } from '../../../../types/helpThread';

export const useHelpThread = (helpId: string) => {
	const [help,   setHelp]   = useState<AcademicHelp | null>(null);
	const [thread, setThread] = useState<HelpThread  | null>(null);
	const [loading, setLoading] = useState(true);

	const load = async () => {
		setLoading(true);
		const [h, { thread: t }] = await Promise.all([
			fetchHelpById(helpId),     
			fetchThread(helpId)       
		]);
		setHelp(h);
		setThread(t);
		setLoading(false);
	};

	useEffect(() => { load(); }, [helpId]);

	const vote  = async (tid: string, mid: string) => {
		await voteMessage(tid, mid);
		load();
	};

	const solve = async (tid: string, mid: string) => {
		await markSolution(tid, mid);
		load();
	};

	const post  = async (content: string, _file?: File) => {
		await postMessage(helpId, { content });
		load();
	};

	return { help, thread, loading, vote, solve, post };
};

