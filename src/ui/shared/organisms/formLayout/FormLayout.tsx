// src/ui/shared/organisms/formLayout/FormLayout.tsx
import React, { useState } from 'react';

import { FormLayoutProps, FormFieldConfig, CustomFieldConfig } from './formLayout.types';
import { FormCard, FormHeader, FormBody, FormActions } from './formLayout.styles';

// Layout & tipografía
import SmartBox from '../../atoms/box/SmartBox';
import GridContainer from '../../atoms/grid/GridContainer';
import GridColumn from '../../atoms/grid/GridColumn';
import Text from '../../atoms/typography/Text';

// Inputs
import TextField from '../../atoms/textFields/TextField';

// Botones
import FilledButton from '../../atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../atoms/buttons/ghostButton/GhostButton';
import IconButton from '../../atoms/buttons/iconButton/IconButton';

// Feedback
import Alert from '../../atoms/feedback/alert/Alert';
import Loader from '../../atoms/feedback/loader/Loader';

// Iconos para mostrar/ocultar contraseña
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const DEFAULT_COLUMNS = { xxs: 4, sm: 8, md: 12 };

const isCustomField = (f: FormFieldConfig): f is CustomFieldConfig =>
	f.type === 'custom';

const FormLayout: React.FC<FormLayoutProps> = ({
	title,
	description,
	fields,
	values,
	onChange,
	onSubmit,
	errorMessage,
	successMessage,
	primaryLabel,
	primaryDisabled,
	secondaryLabel,
	onSecondaryClick,
	columns = DEFAULT_COLUMNS,
	maxWidth = 600,
	loading = false,
}) => {
	// estado interno para mostrar/ocultar contraseñas por campo
	const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

	const togglePassword = (id: string) => {
		setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const renderField = (field: FormFieldConfig) => {
		const {
			id,
			label,
			type = 'text',
			placeholder,
			helperText,
			required,
			span,
			size = 'medium',
		} = field;

		const fieldSpan = span ?? { xxs: 4, sm: 8, md: 12 };
		const value = values[id] ?? '';

		// Campo custom
		if (isCustomField(field)) {
			return (
				<GridColumn key={id} span={fieldSpan}>
					{field.render(field, value, (v) => onChange(id, v))}
				</GridColumn>
			);
		}

		// Campo select simple
		if (field.type === 'select' && 'options' in field) {
			return (
				<GridColumn key={id} span={fieldSpan}>
					<SmartBox column sx={{ gap: 4 }}>
						{label && (
							<Text size="sm" weight="medium">
								{label}
								{required && ' *'}
							</Text>
						)}
						<select
							value={value}
							onChange={(e) => onChange(id, e.target.value)}
							required={required}
							style={{
								padding: '8px 10px',
								borderRadius: 8,
								border: '1px solid #ddd',
								width: '100%',
								fontSize: 14,
							}}
						>
							<option value="" disabled>
								{placeholder || 'Seleccione una opción'}
							</option>
							{field.options.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
						{helperText && (
							<Text size="xs" colorKey="text.secondary">
								{helperText}
							</Text>
						)}
					</SmartBox>
				</GridColumn>
			);
		}

		// Campo normal (text/email/password/number)
		const isPassword = type === 'password';
		const visible = isPassword && showPasswordMap[id];

		return (
			<GridColumn key={id} span={fieldSpan}>
				<TextField
					label={label}
					value={value}
					onChange={(val) => onChange(id, val)}
					placeholder={placeholder}
					type={isPassword ? (visible ? 'text' : 'password') : (type as any)}
					helperText={helperText}
					size={size}
					endAdornment={
						isPassword ? (
							<IconButton
								ariaLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
								sizeType="sm"
								colorType="primary"
								shape="circle"
								onClick={() => togglePassword(id)}
							>
								{visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
							</IconButton>
					) : undefined
					}
				/>
			</GridColumn>
		);
	};

	return (
		<FormCard
			onSubmit={onSubmit}
			style={{ maxWidth }}
		>
			{/* Encabezado */}
			<FormHeader>
				{title && (
					<Text headingLevel="h3" system="sans">
						{title}
					</Text>
				)}
				{description && (
					<Text size="sm" colorKey="text.secondary">
						{description}
					</Text>
				)}
			</FormHeader>

			{/* Mensajes globales */}
			{errorMessage && (
				<Alert type="error" variant="standard">
					{errorMessage}
				</Alert>
			)}
			{successMessage && (
				<Alert type="success" variant="standard">
					{successMessage}
				</Alert>
			)}

			{/* Cuerpo: grid responsivo de campos */}
			<FormBody>
				<GridContainer variant="desktopFluid" columns={columns}>
					{fields.map(renderField)}
				</GridContainer>
			</FormBody>

			{/* Acciones */}
			<FormActions>
				<FilledButton
					type="submit"
					colorType="primary"
					btnVariant="solid"
					shape="rounded"
					fullWidth
					disabled={primaryDisabled || loading}
				>
					{loading ? 'Procesando…' : primaryLabel}
				</FilledButton>

				{secondaryLabel && onSecondaryClick && (
					<GhostButton
						type="button"
						colorType="secondary"
						onClick={onSecondaryClick}
						fullWidth
						label={secondaryLabel}
					/>
				)}

				{loading && (
					<Loader
						size="small"
						centered
						message="Por favor espera…"
					/>
				)}
			</FormActions>
		</FormCard>
	);
};

export default FormLayout;

