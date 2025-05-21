import React, { useState, useCallback } from 'react';
import IconCardItem      from './IconCardItem';
import { ListGrid }      from './iconCardList.styles';
import type { IconCardListProps } from './iconCardList.types';

const IconCardList: React.FC<IconCardListProps> = ({
	items,
	selectedIds,
	onSelect,
	className,
}) => {
	/* modo controlado / no controlado */
	const [internalSel, setInternalSel] = useState<string[]>([]);

	const selectedSet = new Set(selectedIds ?? internalSel);

	const handleToggle = useCallback((id: string, checked: boolean) => {
		if (selectedIds) onSelect?.(id, checked);       // controlado
		else {
			setInternalSel(prev => checked
				? [...prev, id]
				: prev.filter(x => x !== id));
				onSelect?.(id, checked);
		}
	}, [selectedIds, onSelect]);

	return (
		<ListGrid className={className}>
			{items.map(item => (
				<IconCardItem
					key={item.id}
					{...item}
					selected={selectedSet.has(item.id)}
					onToggle={handleToggle}
				/>
			))}
		</ListGrid>
	);
};

export default React.memo(IconCardList);

