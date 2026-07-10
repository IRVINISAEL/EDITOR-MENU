FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero para aprovechar la cache de Docker
COPY package*.json ./
RUN npm install --omit=dev

# Copiar el resto del código
COPY . .

EXPOSE 4000

CMD ["node", "index.js"]
