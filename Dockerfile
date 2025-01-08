# Usa una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración (package.json y package-lock.json) al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

RUN npm install -g sequelize-cli

# Copia el resto de los archivos de tu proyecto al contenedor
COPY . .

# Expone el puerto en el que corre tu aplicación (asegúrate de que coincide con el puerto configurado en tu app)
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
