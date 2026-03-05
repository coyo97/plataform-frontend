import { ReactNode } from 'react';

export interface CardAuthor {
	name: string;
	avatarUrl?: string;
	subtitle?: string; 
}

export interface CardProps {
	  title?: ReactNode;         
  description?: ReactNode;   
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

