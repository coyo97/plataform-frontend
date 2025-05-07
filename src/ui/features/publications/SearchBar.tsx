// src/ui/components/publications/SearchBar.tsx
import React, { useState } from 'react';
import { TextField, IconButton, Paper, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
	onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const theme = useTheme();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(searchQuery.trim());
	};

	return (
		<Paper
			component="form"
			onSubmit={handleSubmit}
			sx={{
				mb: 3,
				p: 0.5,
				display: 'flex',
				alignItems: 'center',
				borderRadius: theme.shape.borderRadius * 2,
				boxShadow: theme.shadows[2],
				width: { xs: '100%', sm: 340 },
			}}
		>
			<TextField
				variant="standard"
				placeholder="Buscar publicaciones…"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				InputProps={{ disableUnderline: true }}
				sx={{ flex: 1, ml: 1 }}
			/>
			<IconButton type="submit" color="primary" sx={{ p: 1 }}>
				<SearchIcon />
			</IconButton>
		</Paper>
	);
};

export default React.memo(SearchBar);

