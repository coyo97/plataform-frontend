import * as React from 'react';
import {
	Autocomplete,
	TextField as MUITextField,
	Box,
	SxProps,
	Theme,
} from '@mui/material';

export type CareerOption = {
	_id: string;
	name: string;
	faculty?: string; // opcional (por si quieres agrupar)
};

type SingleProps = {
	careers: CareerOption[];
	value: string | null;                     // id seleccionado
	onChange: (id: string | null) => void;
	multiple?: false;
};

type MultiProps = {
	careers: CareerOption[];
	value: string[];                          // lista de ids
	onChange: (ids: string[]) => void;
	multiple: true;
};

export type CareerComboboxProps = (SingleProps | MultiProps) & {
	label?: string;
	required?: boolean;
	error?: boolean;
	helperText?: string;
	placeholder?: string;
	disabled?: boolean;
	groupByFaculty?: boolean;
	sx?: SxProps<Theme>;
};

const CareerCombobox: React.FC<CareerComboboxProps> = ({
	careers,
	value,
	onChange,
	multiple,
	label = 'Carrera *',
	required = false,
	error,
	helperText,
	placeholder = 'Busca o elige…',
	disabled,
	groupByFaculty = false,
	sx,
}) => {
	const optionFromId = React.useCallback(
		(id: string) => careers.find((c) => c._id === id) ?? null,
		[careers]
	);

	const valueAsOption = React.useMemo(() => {
		if (multiple) {
			const ids = value as string[];
			return ids.map(optionFromId).filter(Boolean);
		}
		return value ? optionFromId(value as string) : null;
	}, [value, multiple, optionFromId]);

	return (
		<Autocomplete
			sx={sx}
			disabled={disabled}
			options={careers}
			value={valueAsOption as any}
			multiple={!!multiple}
			disableCloseOnSelect={!!multiple}
			selectOnFocus
			clearOnBlur={false}
			handleHomeEndKeys
			getOptionLabel={(o) => o?.name ?? ''}
			isOptionEqualToValue={(o, v) => o._id === v._id}
			onChange={(_, opt) => {
				if (multiple) {
					const next = (opt as CareerOption[] | null)?.map((o) => o._id) ?? [];
					(onChange as (ids: string[]) => void)(next);
				} else {
					const id = (opt as CareerOption | null)?._id ?? null;
					(onChange as (id: string | null) => void)(id);
				}
			}}
			// Popper/Portal: flota sobre la UI (no empuja el form)
			disablePortal={false}
			slotProps={{
				popper: {
					sx: (theme) => ({ zIndex: theme.zIndex.modal + 1 }),
			},
			paper: {
				sx: { maxHeight: 320, overflow: 'auto' }, // altura máx. listbox
			},
			}}
			groupBy={groupByFaculty ? (o) => o.faculty ?? '' : undefined}
			renderInput={(params) => (
				<MUITextField
					{...params}
					size="small"
					label={label}
					required={required}
					error={!!error}
					helperText={helperText}
					placeholder={placeholder}
				/>
			)}
			renderTags={(value, getTagProps) =>
				value.map((option, index) => (
					<Box
						  {...getTagProps({ index })}
						component="span"
						sx={{
							display: 'inline-flex',
							alignItems: 'center',
							px: 1,
							py: 0.25,
							mr: 0.5,
							mb: 0.5,
							borderRadius: 1,
							fontSize: '0.8125rem',
							bgcolor: 'grey.100',
						}}
						{...getTagProps({ index })}
					>
						{(option as CareerOption).name}
					</Box>
			))
			}
		/>
	);
};

export default CareerCombobox;

