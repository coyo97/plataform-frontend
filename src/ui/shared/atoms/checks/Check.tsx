// shared/atoms/checks/Check.tsx
import React from 'react';
import {
	Wrapper,
	HiddenCheckbox,
	StyledBox,
	CheckMark,
} from './check.styles';
import type { CheckProps } from './check.types';

const Check: React.FC<CheckProps> = ({
	checked,
	onChange,
	disabled = false,
	variant = 'default',
	label,
	className,
}) => {
	const handleToggle = () => {
		if (!disabled) onChange(!checked);
	};

	return (
		<Wrapper
			role="checkbox"
			aria-checked={checked}
			aria-disabled={disabled}
			onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && handleToggle()}
			tabIndex={disabled ? -1 : 0}
			className={className}
		>
			<HiddenCheckbox
				type="checkbox"
				checked={checked}
				disabled={disabled}
				onChange={() => {}}
			/>

			<StyledBox
				$checked={checked}
				$variant={variant}
				$disabled={disabled}
				onClick={handleToggle}
			>
				{checked && (
					<CheckMark viewBox="0 0 16 16">
						<polyline
							points="2 8 6 12 14 4"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</CheckMark>
				)}
			</StyledBox>

			{label && (
				<span
					style={{
						userSelect: 'none',
						color: disabled
							? 'rgba(0,0,0,0.38)'
							: 'inherit',
					}}
				>
					{label}
				</span>
			)}
		</Wrapper>
	);
};

export default React.memo(Check);

