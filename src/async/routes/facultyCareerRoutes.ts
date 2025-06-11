/* rutas REST relativas al prefijo /v1.0/api */
export const FACULTIES        = '/faculties';
export const FACULTY_BY_ID    = (id:string)=>`${FACULTIES}/${id}`;

export const CAREERS          = '/careers';
export const CAREER_BY_ID     = (id:string)=>`${CAREERS}/${id}`;

