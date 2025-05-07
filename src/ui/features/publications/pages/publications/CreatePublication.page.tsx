import React, { useEffect, useState } from 'react';
import {
	fetchCareers, Career,
	createPublication, Publication,
} from '../../../../../async/services/publicationService';

import CreatePublicationForm from '../../organisms/createPublicationForm/CreatePublicationForm';

/* Un wrapper por si quieres mostrar feedback o navegar luego -------------- */
const CreatePublicationPage: React.FC = () => {
	const [careers,setCareers] = useState<Career[]>([]);

	/* cargar carreras (con caché del service) */
	useEffect(()=>{
		fetchCareers()
		.then(setCareers)
		.catch(console.error);
	},[]);

	/* submit handler delega en el service */
	const handleSubmit = async (fd: FormData): Promise<Publication> => {
		const newPub = await createPublication(fd);   // <- devuelve Publication
		// feedback opcional:
		console.log('Publicación creada', newPub);
		// por ejemplo, navegar a /publications o mostrar toast…

		return newPub; // IMPORTANTE → el organismo lo necesita
	};

	/* ── handler para que el organismo avise al padre ───── */
	const handleCreated = (pub: Publication) => {
		console.log('[Page] onCreated:', pub);
		// aquí no hacemos nada, porque esta page está aislada
		// pero podrías redirigir al detalle, etc.
	};

	return (
		<CreatePublicationForm
			careers={careers}
			onSubmit={handleSubmit}
			onCreated={handleCreated}
		/>
	);
};

export default CreatePublicationPage;

