import { ReactNode } from 'react';

export type RenderFilePreviewVariant = 'cover' | 'contain';

export interface RenderFileProps {
	filePath: string;

	fileType: string;

	title?: string;

	baseUrl: string;

	authorName?: string;

	elevation?: 0 | 1 | 2 | 3;

	enableZoom?: boolean;

	maxFeedHeight?: string | number;

	previewVariant?: RenderFilePreviewVariant;

	onOpenPreview?: () => void;
	onClosePreview?: () => void;

	buttonLabels?: {
		viewPdf?: string;     
		download?: string;   
	};

	belowSlot?: ReactNode;
}

