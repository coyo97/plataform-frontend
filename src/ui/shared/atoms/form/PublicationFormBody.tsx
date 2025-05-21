import React from 'react';
import { Body } from './publicationForm.styles';

const PublicationFormBody: React.FC<{ children: React.ReactNode }> = ({ children }) =>
	<Body>{children}</Body>;

export default PublicationFormBody;

