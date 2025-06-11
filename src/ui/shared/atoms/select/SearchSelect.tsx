// ui/shared/atoms/select/SearchSelect.tsx
import React, { useMemo, useState, useRef } from 'react';

import { Wrapper, SelectBox, Dropdown, Option } from '../../molecules/selector/careerSelector.styles';

import Text        from '../typography/Text';
import SmartBox    from '../box/SmartBox';
import ChevronDown from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon  from '@mui/icons-material/Search';

export interface SelectOption { value:string; label:string }
export interface SearchSelectProps {
	options      : SelectOption[];
	value?       : string;
	onChange     : (v:string)=>void;
	placeholder ?: string;
	label?      : string;
	required?   : boolean;
	disabled?   : boolean;
	error?      : boolean;
	variant?   : 'default'|'transparent';
	dropdownMode?: 'overlay'|'inline';
}

const SearchSelect:React.FC<SearchSelectProps>=({
	options, value, onChange, placeholder='Seleccionar…',
	label, required, disabled=false, error=false,
	variant='default', dropdownMode='overlay'
})=>{
	const [open,setOpen]     = useState(false);
	const [search,setSearch] = useState('');
	const boxRef = useRef<HTMLDivElement>(null);

	const selLabel = options.find(o=>o.value===value)?.label;
	const filtered = useMemo(()=>(
		search? options.filter(o=>o.label.toLowerCase().includes(search.toLowerCase())) : options
	),[options,search]);

	const choose=(v:string)=>{ onChange(v); setOpen(false); setSearch(''); boxRef.current?.focus(); };

	return(
		<SmartBox column>
			{label && <Text size="sm" weight="medium">{label}{required&&' *'}</Text>}

			<Wrapper>
				<SelectBox
					ref={boxRef} aria-haspopup="listbox" aria-expanded={open}
					onClick={()=>!disabled&&setOpen(p=>!p)}
					$error={error} $disabled={disabled} $variant={variant}
				>
					<Text >{ selLabel??placeholder }</Text>
					<ChevronDown fontSize="small"/>
				</SelectBox>

				{open&&(
					<Dropdown role="listbox" $variant={variant} $dropdownMode={dropdownMode}>
						<SmartBox row gap="px4" p="px8" center>
							<SearchIcon fontSize="small"/>
							<input
								style={{border:'none',outline:'none',flex:1}}
								placeholder="Buscar…"
								value={search} onChange={e=>setSearch(e.target.value)}
							/>
						</SmartBox>
						{filtered.map(o=>(
							<Option key={o.value} $active={o.value===value}
								onClick={()=>choose(o.value)} role="option"
								aria-selected={o.value===value}>
								<Text>{o.label}</Text>
							</Option>
						))}
					</Dropdown>
				)}
			</Wrapper>
		</SmartBox>
	);
};

export default SearchSelect;

