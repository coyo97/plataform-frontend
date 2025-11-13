// src/ui/shared/utils/validation/rules.ts

// Longitudes recomendadas
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 40;

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 60;
// Permite letras (incluyendo acentos), espacios, apóstrofo y guion
export const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]+$/;


export const EMAIL_MAX_LENGTH = 150; // por debajo del máximo RFC para no abusar

export const PASSWORD_MIN_LENGTH = 10; // según lo que hablamos (NIST recomienda >= 8)
export const PASSWORD_MAX_LENGTH = 64;

// Regex basados en buenas prácticas (no en los RFC ultra complicados)
export const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;

// ejemplo: algo@dominio.com
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Caracteres de control (no imprimibles) que NO queremos en contraseñas, usuarios, etc.
export const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/;

// Si quisieras restringir aún más, puedes añadir aquí otros patrones de bloqueo

