/* FileButton.tsx */
import React, { useRef } from 'react';
import FilledButton from '../filledButton/FilledButton';

interface Props {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	label?  : string;
}

const FileButton: React.FC<Props> = ({ onChange, label='Seleccionar archivo' }) => {
	const hiddenInput = useRef<HTMLInputElement>(null);

	return (
		<>
			<input
				ref={hiddenInput}
				type="file"
				style={{ display:'none' }}
				onChange={onChange}
			/>
			<FilledButton
				variant="ghost"
				colorType="secondary"
				onClick={() => hiddenInput.current?.click()}
			>
				{label}
			</FilledButton>
		</>
	);
};

export default FileButton;

