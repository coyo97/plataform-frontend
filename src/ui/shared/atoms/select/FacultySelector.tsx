// ui/shared/molecules/selector/FacultySelector.tsx
import SearchSelect,{SelectOption} from '../../atoms/select/SearchSelect';
import { Faculty } from '../../../../types/faculty';

interface Props{
	faculties:Faculty[];
	value?:string;
	onChange:(id:string)=>void;
}

const FacultySelector:React.FC<Props>=({faculties,value,onChange,...rest})=>{
	const opts:SelectOption[] = faculties.map(f=>({value:f._id,label:f.name}));
	return <SearchSelect options={opts} value={value} onChange={onChange} {...rest}/>;
};
export default FacultySelector;

