import React from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import FilledButton from '../../../shared/atoms/buttons/filledButton/FilledButton';
import type { Faculty, Career } from '../AssignRolesToUser';

interface Props {
	faculties: Faculty[];
	careers: Career[];
	facultyId: string;
	selectedCareerIds: string[];
	careerOptionsForFaculty: Career[];
	onFacultyChange: (id: string) => void;
	onCareersChange: (ids: string[]) => void;
	onSelectAllCareers: () => void;
	onClearCareers: () => void;
}

const FacultyCareerFilter: React.FC<Props> = ({
	faculties,
	careers,
	facultyId,
	selectedCareerIds,
	careerOptionsForFaculty,
	onFacultyChange,
	onCareersChange,
	onSelectAllCareers,
	onClearCareers,
}) => {
	return (
		<>
			{/* Facultad */}
			<Autocomplete
				sx={{ flex: 1, minWidth: 260 }}
				options={[{ _id: '', name: '— Todas las Facultades —' } as Faculty, ...faculties]}
				value={faculties.find(f => f._id === facultyId) ?? ({ _id: '', name: '— Todas las Facultades —' } as Faculty)}
				onChange={(_, val) => {
					const id = (val as Faculty | null)?._id ?? '';
					onFacultyChange(id);
				}}
				isOptionEqualToValue={(a, b) => a._id === b._id}
				getOptionLabel={(f) => f?.name ?? ''}
				renderInput={(p) => <TextField {...p} label="Filtrar por Facultad" />}
			/>

			{/* Carreras (multiple) */}
			<Autocomplete
				multiple
				disableCloseOnSelect
				sx={{ flex: 1, minWidth: 260 }}
				options={facultyId ? careerOptionsForFaculty : careers}
				value={(facultyId ? careerOptionsForFaculty : careers).filter(c => selectedCareerIds.includes(c._id))}
				onChange={(_, vals) => onCareersChange(vals.map(v => v._id))}
				isOptionEqualToValue={(a, b) => a._id === b._id}
				getOptionLabel={(c) => c?.name ?? ''}
				renderInput={(p) => <TextField {...p} label={facultyId ? 'Carreras (de esta facultad)' : 'Carreras'} />}
				renderOption={(props, option, { selected }) => (
					<li {...props}>
						<input type="checkbox" checked={selected} readOnly style={{ marginRight: 8 }} />
						{option.name}
					</li>
				)}
			/>

			{facultyId && (
				<Box sx={{ display: 'flex', gap: 8 }}>
					<FilledButton btnVariant="outline" onClick={onSelectAllCareers}>
						Marcar todas
					</FilledButton>
					<FilledButton btnVariant="outline" onClick={onClearCareers}>
						Desmarcar todas
					</FilledButton>
				</Box>
			)}
		</>
	);
};

export default FacultyCareerFilter;

