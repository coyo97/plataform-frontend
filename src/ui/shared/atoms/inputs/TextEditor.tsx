// src/ui/shared/atoms/inputs/TextEditor.tsx
import React, { useEffect, useRef, useState } from 'react';
import { TextEditorProps } from './textEditor.types';

import {
	StyledWrapper,
	StyledLabel,
	StyledInputContainer,
	StyledHint,
	StyledError,
	IconContainer,
	StyledToolbar,
	ToolbarButton,
	StyledEditor,
} from './textEditor.styles';

const TextEditor: React.FC<TextEditorProps> = ({
	label,
	placeholder,
	value,
	onChange,
	leftIcon,
	rightIcon,
	hint,
	error,
	disabled = false,
	minHeight = 140,
	toolbarOptions = {
		bold: true,
		italic: true,
		underline: true,
		bulletList: true,
		orderedList: true,
	},
}) => {
	const editorRef = useRef<HTMLDivElement | null>(null);

	// formatos activos (para marcar B / I / U)
	const [formatState, setFormatState] = useState({
		bold: false,
		italic: false,
		underline: false,
	});

	// Sincroniza el value externo con el contenido del editor
	useEffect(() => {
		if (!editorRef.current) return;
		const current = editorRef.current.innerHTML;
		if (value !== current) {
			editorRef.current.innerHTML = value || '';
		}
	}, [value]);

	const emitChange = () => {
		if (!editorRef.current) return;
		onChange(editorRef.current.innerHTML);
	};

	const updateFormatState = () => {
		if (!editorRef.current) return;
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return;
		// solo actualizamos si la selección está dentro de este editor
		if (!editorRef.current.contains(sel.anchorNode)) return;

		setFormatState({
			bold: document.queryCommandState('bold'),
			italic: document.queryCommandState('italic'),
			underline: document.queryCommandState('underline'),
		});
	};

	const handleInput = () => {
		emitChange();
		updateFormatState();
	};

	const focusAtEnd = () => {
		if (!editorRef.current) return;
		const el = editorRef.current;
		el.focus();

		// mueve el cursor al final
		const range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		const sel = window.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(range);
	};

	const handleCommand = (command: string) => {
		if (disabled || !editorRef.current) return;

		const el = editorRef.current;
		const sel = window.getSelection();

		const hasSelectionInsideEditor =
			sel &&
			sel.rangeCount > 0 &&
			el.contains(sel.anchorNode);

		if (hasSelectionInsideEditor) {
			// Solo enfocamos el editor para que el documento sepa que el target es él,
			// pero NO tocamos la selección (se mantiene sobre el texto elegido).
			el.focus();
		} else {
			// No hay selección dentro → ponemos el cursor al final y aplicamos en adelante
			focusAtEnd();
		}

		document.execCommand(command, false);
		emitChange();
		updateFormatState();
	};

	const handleMouseDownToolbar = (e: React.MouseEvent) => {
		// evita perder el foco / selección del editor
		e.preventDefault();
	};

	// Escuchamos cambios de selección para marcar/desmarcar B / I / U
	useEffect(() => {
		const handler = () => {
			updateFormatState();
		};
		document.addEventListener('selectionchange', handler);
		return () => {
			document.removeEventListener('selectionchange', handler);
		};
	}, []);

	return (
		<StyledWrapper disabled={disabled}>
			{label && <StyledLabel>{label}</StyledLabel>}

			<StyledInputContainer error={!!error} disabled={disabled}>
				{leftIcon && <IconContainer position="left">{leftIcon}</IconContainer>}

				<StyledToolbar onMouseDown={handleMouseDownToolbar}>
					{toolbarOptions.bold && (
						<ToolbarButton
							type="button"
							onClick={() => handleCommand('bold')}
							disabled={disabled}
							active={formatState.bold}
						>
							B
						</ToolbarButton>
					)}
					{toolbarOptions.italic && (
						<ToolbarButton
							type="button"
							onClick={() => handleCommand('italic')}
							disabled={disabled}
							active={formatState.italic}
						>
							I
						</ToolbarButton>
					)}
					{toolbarOptions.underline && (
						<ToolbarButton
							type="button"
							onClick={() => handleCommand('underline')}
							disabled={disabled}
							active={formatState.underline}
						>
							U
						</ToolbarButton>
					)}
					{toolbarOptions.bulletList && (
						<ToolbarButton
							type="button"
							onClick={() => handleCommand('insertUnorderedList')}
							disabled={disabled}
						>
							• List
						</ToolbarButton>
					)}
					{toolbarOptions.orderedList && (
						<ToolbarButton
							type="button"
							onClick={() => handleCommand('insertOrderedList')}
							disabled={disabled}
						>
							1. List
						</ToolbarButton>
					)}
				</StyledToolbar>

				<StyledEditor
					ref={editorRef}
					contentEditable={!disabled}
					data-placeholder={placeholder}
					onInput={handleInput}
					style={{ minHeight }}
					dir="ltr"
					suppressContentEditableWarning
				/>

				{rightIcon && <IconContainer position="right">{rightIcon}</IconContainer>}
			</StyledInputContainer>

			{error ? (
				<StyledError>{error}</StyledError>
			) : (
				hint && <StyledHint>{hint}</StyledHint>
			)}
		</StyledWrapper>
	);
};

export default TextEditor;

