import React from 'react';
import TagChip from '../../atoms/tags/TagChip';
import { Anchor, ChipsRow } from './tagChips.styles';
import type { TagChipsProps } from './tagChips.types';

/** Patrones: lista de chips truncable con “+N”.
 *  Semántica clara: <a> envuelve Chip cuando hay navegación (Tidwell, Kalbag). */
const TagChips: React.FC<TagChipsProps> = ({
	items,
	maxVisible = 8,
	getHref,
	externalLinks,
	className,
}) => {
	const visible = items.slice(0, maxVisible);
	const hidden = Math.max(0, items.length - visible.length);

	return (
		<ChipsRow className={className}>
			{visible.map((t, i) => {
				const href = getHref?.(t);
				if (href) {
					return (
						<Anchor
							key={`${t}-${i}`}
							href={href}
							target={externalLinks ? '_blank' : undefined}
							rel={externalLinks ? 'noopener noreferrer' : undefined}
							aria-label={`Ver elementos con etiqueta ${t}`}
						>
							<TagChip label={t} clickable />
						</Anchor>
					);
				}
				return <TagChip key={`${t}-${i}`} label={t} />;
			})}
			{hidden > 0 && <TagChip label={`+${hidden}`} variant="outlined" />}
		</ChipsRow>
	);
};

export default TagChips;

