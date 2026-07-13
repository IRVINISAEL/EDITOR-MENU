FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero para aprovechar la cache de Docker
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el resto del código
COPY . .

# No correr como root: la imagen node:alpine ya trae el usuario "node"
USER node

EXPOSE 4000

CMD ["node", "index.js"]
