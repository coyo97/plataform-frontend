// src/ui/shared/atoms/typography/RichText.tsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Text from './Text';

export interface RichTextProps {
	as?: React.ElementType;
	html: string;
	sx?: Record<string, any>;
}


const RichText: React.FC<RichTextProps> = ({ as, html, sx = {}, ...rest }) => {
	const theme = useTheme();
	const Component = as || 'div';

	const baseSx: Record<string, any> = {

		'& *': {
			fontFamily: 'inherit !important',
			fontSize: 'inherit !important',
			lineHeight: 'inherit !important',
		},

		'& b, & strong': {
			fontWeight: 700,
		},
		'& i, & em': {
			fontStyle: 'italic',
		},
		'& u': {
			textDecoration: 'underline',
		},

		'& ul, & ol': {
			paddingLeft: '1.5rem',
			marginTop: '0.5rem',
			marginBottom: '0.5rem',
		},
		'& ul': {
			listStyleType: 'disc',
		},
		'& ol': {
			listStyleType: 'decimal',
		},
		'& li': {
			marginBottom: '0.25rem',
		},
	};

	return (
		<Text
			as={Component as any}
			size="sm" 
			sx={{ ...baseSx, ...sx }}
			dangerouslySetInnerHTML={{ __html: html }}
			{...(rest as any)}
		/>
	);
};

export default RichText;

