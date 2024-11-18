# Usa la misma versión de Node.js que tienes localmente
FROM node:18

# Configura el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo los archivos de dependencias para aprovechar la caché
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Expone el puerto en el que corre el frontend
EXPOSE 3000

# Comando para iniciar el frontend en modo desarrollo
CMD ["npm", "start"]

