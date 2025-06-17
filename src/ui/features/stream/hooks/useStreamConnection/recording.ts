export const createRecorder = (deps: {
	streamId: string;
	isStreamer: boolean;
}) => {
	const { streamId, isStreamer } = deps;
	let mediaRecorder: MediaRecorder | null = null;
	const recordedChunks: Blob[] = [];

	const startRecording = () => {
		const vid = document.getElementById(
			isStreamer ? 'localVideo' : 'remoteVideo',
		) as HTMLVideoElement | null;

		if (vid && vid.srcObject) {
			const recorder = new MediaRecorder(vid.srcObject as MediaStream);
			recorder.ondataavailable = e => {
				if (e.data.size > 0) recordedChunks.push(e.data);
			};
			recorder.start();
			mediaRecorder = recorder;
		}
	};

	const stopRecording = () => {
		if (mediaRecorder) {
			mediaRecorder.stop();
			mediaRecorder.onstop = () => {
				const blob = new Blob(recordedChunks, { type: 'video/webm' });
				const url = URL.createObjectURL(blob);
				const a   = document.createElement('a');
				a.href = url;
				a.download = `stream_${streamId}.webm`;
				a.click();
				URL.revokeObjectURL(url);
				recordedChunks.length = 0;
				mediaRecorder = null;
			};
		}
	};

	return { startRecording, stopRecording };
};

