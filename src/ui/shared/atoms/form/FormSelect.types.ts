// shared/atoms/form/FormSelect.types.ts
import { SelectProps } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { ButtonColorType } from '../buttons/button.types';

export type SelectVariantType = 'solid' | 'outline' | 'underline';

export type FormSelectProps = Omit<
  React.ComponentPropsWithoutRef<typeof import('@mui/material/Select')['default']>,
  'onChange'
> &{
	colorType?: ButtonColorType;
	variantType?: SelectVariantType;
	label?: string;
	 options?: { value: string; label: string }[];
	 onChange?: (value: string, event: SelectChangeEvent<string>) => void;
};

