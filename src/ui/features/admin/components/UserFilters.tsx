import React from 'react';
import {
	Box,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	TextField as MuiTextField,
	Autocomplete,
	Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Text from '../../../shared/atoms/typography/Text';
import type { Faculty, Career } from '../UserManagement';

interface Props {
	faculties: Faculty[];
	careers: Career[];
	selectedFaculty: string;
	setSelectedFaculty: (id: string) => void;
	selectedCareerIds: string[];
	setSelectedCareerIds: (ids: string[]) => void;
	selectedStatus: string;
	onStatusChange: (status: string) => void;
	searchQuery: string;
	onSearchChange: (q: string) => void;
	careerOptionsForFaculty: Career[];
}

export const UserFilters: React.FC<Props> = ({
	faculties,
	careers,
	selectedFaculty,
	setSelectedFaculty,
	selectedCareerIds,
	setSelectedCareerIds,
	selectedStatus,
	onStatusChange,
	searchQuery,
	onSearchChange,
	careerOptionsForFaculty,
}) => {
	return (
		<Box
			sx={{
				display: 'grid',
				gridTemplateColumns: { xs: '1fr', sm: '1fr 260px', md: '1fr 240px 360px 220px' },
			gap: 2,
			alignItems: 'center',
			mb: 2,
			}}
		>
			{/* Buscador */}
			<MuiTextField
				placeholder="Buscar usuario por nombre o email"
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				variant="outlined"
				size="small"
				fullWidth
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon fontSize="small" />
						</InputAdornment>
					),
				}}
			/>

			{/* Facultad */}
			<FormControl size="small" sx={{ minWidth: 220 }}>
				<InputLabel id="faculty-label">Todas las Facultades</InputLabel>
				<Select
					labelId="faculty-label"
					value={selectedFaculty}
					label="Todas las Facultades"
					onChange={(e) => {
						const id = e.target.value as string;
						setSelectedFaculty(id);
					}}
					renderValue={(v) =>
						v ? (faculties.find((f) => f._id === v)?.name ?? 'Facultad') : 'Todas las Facultades'
					}
				>
					<MenuItem value="">
						<Text as="span" size="sm">Todas las Facultades</Text>
					</MenuItem>
					{faculties.map((f) => (
						<MenuItem key={f._id} value={f._id}>
							<Text as="span" size="sm">{f.name}</Text>
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{/* Carreras (múltiple) */}
			<Autocomplete
				multiple
				disableCloseOnSelect
				options={selectedFaculty ? careerOptionsForFaculty : careers}
				value={(selectedFaculty ? careerOptionsForFaculty : careers).filter(c => selectedCareerIds.includes(c._id))}
				onChange={(_, vals) => setSelectedCareerIds(vals.map(v => v._id))}
				isOptionEqualToValue={(a, b) => a._id === b._id}
				getOptionLabel={(c) => c?.name ?? ''}
				renderTags={(value, getTagProps) =>
					value.map((option, index) => (
						<Chip {...getTagProps({ index })} key={option._id} label={option.name} />
				))
				}
				renderInput={(params) => (
					<MuiTextField
						{...params}
						size="small"
						label={selectedFaculty ? 'Carreras (de la facultad)' : 'Carreras'}
						placeholder="Seleccionar carreras…"
					/>
				)}
			/>

			{/* Estado */}
			<FormControl size="small" sx={{ minWidth: 200 }}>
				<InputLabel id="status-label">Todos los Estados</InputLabel>
				<Select
					labelId="status-label"
					value={selectedStatus}
					label="Todos los Estados"
					onChange={(e) => onStatusChange(e.target.value as string)}
				>
					<MenuItem value="">
						<Text as="span" size="sm">Todos los Estados</Text>
					</MenuItem>
					<MenuItem value="active"><Text as="span" size="sm">Activo</Text></MenuItem>
					<MenuItem value="deactivated"><Text as="span" size="sm">Desactivado</Text></MenuItem>
					<MenuItem value="blacklisted"><Text as="span" size="sm">Bloqueado</Text></MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
};
