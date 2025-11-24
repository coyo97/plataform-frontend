// src/ui/features/stream/organisms/streamPlayer/StreamPlayer.styles.ts
import type { CSSProperties } from 'react';

export const liveChipStyle: CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 6,
	padding: '2px 8px',
	borderRadius: 999,
	fontSize: 11,
	fontWeight: 800,
	background: 'rgba(229,57,53,0.92)',
	color: '#fff',
	letterSpacing: 0.4,
	boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
	backdropFilter: 'blur(6px)',
};

export const substateStyle: CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 6,
	fontSize: 13,
	fontWeight: 600,
	opacity: 0.9,
	animation: 'blinkDot 1.6s ease-in-out infinite',
};

// CSS global del player
export const PLAYER_GLOBAL_CSS = `
@keyframes blinkDot {
	0% { opacity: 1; }
	50% { opacity: .55; }
	100% { opacity: 1; }
}

#screenGrid {
	scrollbar-width: thin;
}

#screenGrid::-webkit-scrollbar {
	height: 6px;
}
#screenGrid::-webkit-scrollbar-track {
	background: transparent;
}
#screenGrid::-webkit-scrollbar-thumb {
	background: rgba(255,255,255,0.25);
	border-radius: 999px;
}

#screenGrid > video {
	min-width: 220px;
	max-width: 260px;
	aspect-ratio: 16 / 9;
	border-radius: 12px;
	object-fit: cover;
	background: #000;
	box-shadow: 0 8px 20px rgba(0,0,0,0.40);
	border: 1px solid rgba(255,255,255,0.16);
}

#screenGrid > video.screen-sharing {
	box-shadow: 0 0 0 2px #00C853, 0 12px 30px rgba(0,200,83,0.45);
	border-color: #00C853;
}

@keyframes talkingPulse {
	0% { box-shadow: 0 0 0 0 rgba(33,150,243,0.7); }
	70% { box-shadow: 0 0 0 6px rgba(33,150,243,0); }
	100% { box-shadow: 0 0 0 0 rgba(33,150,243,0); }
}
#screenGrid > video.is-talking {
	animation: talkingPulse 1.4s ease-out infinite;
	border-color: #2196F3;
}

#screenGrid > video.mic-off {
	filter: grayscale(0.15) brightness(0.9);
	border-style: dashed;
	border-color: rgba(255,255,255,0.35);
}
`;

