// src/ui/shared/atoms/inputs/textEditor.types.ts
import { ReactNode } from 'react';

export interface TextEditorToolbarOptions {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  bulletList?: boolean;
  orderedList?: boolean;
}

export interface TextEditorProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  hint?: string;
  error?: string;
  disabled?: boolean;
  minHeight?: number;
  toolbarOptions?: TextEditorToolbarOptions;
}

