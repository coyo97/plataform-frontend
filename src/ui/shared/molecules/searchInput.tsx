// src/shared/molecules/SearchInput/SearchInput.tsx
import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
	/** callback disparado al buscar */
	onSearch: (value: string) => void;
	placeholder?: string;
	/** activa búsqueda en vivo mientras se escribe */
	liveSearch?: boolean;
	/** tiempo de espera antes de disparar la búsqueda (ms) */
	debounceMs?: number;
	/** dispara búsqueda al perder foco */
	fireOnBlur?: boolean;
	// NUEVO: reenviar focus/click para abrir el overlay
	onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	autoFocus?: boolean;
	 sx?: object;
}

const SearchInput: React.FC<Props> = ({
	onSearch,
	placeholder,
	liveSearch = false,
	debounceMs = 300,
	fireOnBlur = true,
	onFocus,
	onClick,
	autoFocus,
	sx,
}) => {
	const [value, setValue] = useState('');

	// Función que dispara búsqueda manual
	const fire = () => {
		const q = value.trim();
		if (q) onSearch(q);
	};
	// Efecto para búsqueda en vivo con debounce
	useEffect(() => {
		if (!liveSearch) return;
		const t = setTimeout(() => {
			const q = value.trim();
			if (q) onSearch(q);
		}, debounceMs);
		return () => clearTimeout(t);
	}, [value, liveSearch, debounceMs, onSearch]);

	return (
		<TextField
			fullWidth
			size="small"
			value={value}
			placeholder={placeholder ?? 'Buscar Publicación'}
			onChange={(e) => setValue(e.target.value)}
			onKeyDown={(e) => e.key === 'Enter' && fire()}
			onBlur={fireOnBlur ? fire : undefined}
			onFocus={onFocus}    
			onClick={onClick}
			autoFocus={!!autoFocus}
			inputProps={{ 'aria-label': placeholder ?? 'Buscar' }}
			 sx={sx}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon fontSize="small" />
					</InputAdornment>
				),
			}}
		/>
	);
};

export default SearchInput;

