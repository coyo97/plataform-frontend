import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import Text from '../../atoms/typography/Text';
import { Root, IconWrap, Content, Right } from './textItemRow.styles';
import { TextItemRowProps } from './textItemRow.types';

const TextItemRow: React.FC<TextItemRowProps> = ({
	icon,
	label,
	description,
	meta,
	selected,
	disabled,
	onClick,
	href,
	to,
	size = 'md',
	sx,
	startAdornment,
	endAdornment,
}) => {
	const theme = useTheme();

	// Colores diferenciados (icono vs. texto) + estado seleccionado
	const iconColor = selected ? theme.palette.primary.main : theme.palette.text.secondary;
	const labelColorKey = selected ? 'primary.main' : 'text.primary';
	const descColorKey  = 'text.secondary';

	const iconNode = icon
		? React.cloneElement(icon, { sx: { fontSize: 22, color: iconColor } })
		: null;

		// Semántica dinámica: button / a / Link
		const component: any = to ? RouterLink : href ? 'a' : 'button';
		const extraProps = to
			? { to }
			: href
				? { href, target: '_blank', rel: 'noopener noreferrer' }
				: {};

				// TextItemRow.tsx (solo el render)
				return (
					<Root
						component={component as any}   // <- ahora existe en RootProps
						onClick={onClick}
						disabled={disabled}
						selected={selected}
						sizeKey={size}
						sx={sx}
						{...extraProps}
					>
						{(startAdornment ?? iconNode) && (
							<IconWrap>{startAdornment ?? iconNode}</IconWrap>
						)}

						<Content>
							<Text
								as="span"
								size="sm"
								weight={selected ? 'medium' : 'regular'}
								colorKey={labelColorKey}
								sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
							>
								{label}
							</Text>

							{description && (
								<Text
									as="span"
									size="xs"
									colorKey={descColorKey}
									sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
								>
									{description}
								</Text>
							)}
						</Content>

	{(meta || endAdornment) && <Right>{meta}{endAdornment}</Right>}
					</Root>
				);

};

export default TextItemRow;

