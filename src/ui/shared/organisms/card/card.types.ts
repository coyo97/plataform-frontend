import { ReactNode } from 'react';

export interface CardAuthor {
	name: string;
	avatarUrl?: string;
	subtitle?: string; 
}

export interface CardProps {
	  title?: ReactNode;         // <- acepta JSX o string
  description?: ReactNode;   // <- acepta JSX o string
	author?: CardAuthor;
	date?: string | Date;
	tags?: string[];
	media?: ReactNode;   
	actions?: ReactNode;
	footer?: ReactNode;
	onClickAuthor?: () => void;
	onTagClick?: (tag: string) => void;
	headerActions?: React.ReactNode;
	authorCareers?: string[];
	  children?: ReactNode;
}

