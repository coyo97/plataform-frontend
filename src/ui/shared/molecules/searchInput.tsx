// src/shared/molecules/SearchInput/SearchInput.tsx
import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  /** callback disparado sólo al pulsar Enter o al hacer blur */
  onSearch: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<Props> = ({ onSearch, placeholder }) => {
  const [value, set] = useState('');

  const fire = () => onSearch(value.trim());

  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      placeholder={placeholder ?? 'Buscar…'}
      onChange={(e) => set(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && fire()}
      onBlur={fire}
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

