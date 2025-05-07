import React, { useRef } from 'react';
import { Button } from '@mui/material';

interface Props {
  /** callback que recibe el `File` seleccionado */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 *  Input de archivo desacoplado:
 *  – El `<input type="file">` está oculto.  
 *  – El usuario solo ve un botón MUI coherente con el theme.  
 */
const FormFileInput: React.FC<Props> = ({ onChange }) => {
  const hiddenInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={hiddenInput}
        type="file"
        style={{ display: 'none' }}
        onChange={onChange}
      />

      <Button
        variant="outlined"
        onClick={() => hiddenInput.current?.click()}
      >
        Seleccionar archivo
      </Button>
    </>
  );
};

export default FormFileInput;

