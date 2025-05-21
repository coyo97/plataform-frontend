import React from 'react';
import { Actions } from './publicationForm.styles';

const PublicationFormActions: React.FC<{ children: React.ReactNode }> = ({ children }) =>
	<Actions>{children}</Actions>;

export default PublicationFormActions;

