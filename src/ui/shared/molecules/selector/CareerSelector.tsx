import React, { useState, useMemo, useRef } from 'react';
import {
	Wrapper, SelectBox, Dropdown, Option,
} from './careerSelector.styles';
import { CareerSelectorProps } from './careerSelector.types';

import Text       from '../../atoms/typography/Text';
import IconButton from '../../atoms/buttons/iconButton/IconButton';
import SmartBox   from '../../atoms/box/SmartBox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon            from '@mui/icons-material/Search';

const CareerSelector: React.FC<CareerSelectorProps> = ({
	careers,
	value,
	onChange,
	label,
	placeholder = 'Filtrar',
	error = false,
	helperText,
	disabled = false,
	required = false,
	variant = 'default',
	dropdownMode = 'overlay',
}) => {
	const [open, setOpen]     = useState(false);
	const [search, setSearch] = useState('');
	const boxRef = useRef<HTMLDivElement>(null);

	const selected = careers.find(c => c._id === value);

	const filtered = useMemo(() => {
		if (!search) return careers;
		return careers.filter(c =>
							  c.name.toLowerCase().includes(search.toLowerCase()),
							 );
	}, [careers, search]);

	const handleSelect = (id: string) => {
		onChange(id);
		setOpen(false);
		setSearch('');
		boxRef.current?.focus();
	};

	return (
		<SmartBox column>
			{label && (
				<Text size="sm" weight="medium">
					{label}{required && ' *'}
				</Text>
			)}

			<Wrapper>
				<SelectBox
					ref={boxRef}
					$error={error}
					$disabled={disabled}
					onClick={() => !disabled && setOpen(p => !p)}
					aria-haspopup="listbox"
					aria-expanded={open}
					$variant={variant}
				>
					<Text sx={{ color: '#FFD700' }}>
						{selected?.name || placeholder}
					</Text>

					<KeyboardArrowDownIcon fontSize="small" />
				</SelectBox>

				{open && (
					<Dropdown role="listbox" $variant={variant}        $dropdownMode={dropdownMode}   >
						<SmartBox row gap="px4" p="px8" center>
							<SearchIcon fontSize="small" />
							<input
								style={{ border:'none', outline:'none', flex:1 }}
								placeholder="Buscar…"
								value={search}
								onChange={e => setSearch(e.target.value)}
							/>
						</SmartBox>

						{filtered.map(c => (
							<Option
								key={c._id}
								role="option"
								aria-selected={c._id === value}
								$active={c._id === value}
								onClick={() => handleSelect(c._id)}
							>
								<Text>{c.name}</Text>
							</Option>
						))}
					</Dropdown>
				)}
			</Wrapper>

			{helperText && (
				<Text
					size="xs"
					colorKey={error ? 'feedback.negative.600' : 'neutral.graySoft.600'}
				>
					{helperText}
				</Text>
			)}
		</SmartBox>
	);
};

export default CareerSelector;

