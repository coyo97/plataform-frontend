import { ReactNode } from 'react';

export interface MainInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  hint?: string;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  multiline?: boolean;
  rows?: number;
}

