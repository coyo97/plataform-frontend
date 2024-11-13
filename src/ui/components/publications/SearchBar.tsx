import React, { useState } from 'react';

interface SearchBarProps {
	onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState<string>('');

	const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSearch(searchQuery);
	};

	return (
		<form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
			<input
				type="text"
				placeholder="Buscar publicaciones..."
				value={searchQuery}
				onChange={(e) => {
					setSearchQuery(e.target.value);
				}}
				style={{ width: '300px', padding: '8px' }}
			/>
			<button type="submit" style={{ padding: '8px 16px', marginLeft: '8px' }}>
				Buscar
			</button>
		</form>
	);
};

export default React.memo(SearchBar);

