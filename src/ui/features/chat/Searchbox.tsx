import React from 'react';

import { SearchboxContainer, Heading, SearchButton, SearchBar } from './searchBox.styles';

export const Searchbox: React.FC = () => {

	return (
        <SearchboxContainer>
            <div className="recent_heading">
                <Heading>Recientes</Heading>
            </div>
            <SearchBar>
                <SearchButton>Salir</SearchButton>
            </SearchBar>
        </SearchboxContainer>
    );

};
