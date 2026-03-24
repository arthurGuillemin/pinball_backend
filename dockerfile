FROM node:20-alpine

WORKDIR /app

# Installer les dépendances d'abord pour profiter du cache Docker
COPY package*.json ./
RUN npm ci

# Copier le reste du code
COPY . .

# Port utilisé par ton serveur
EXPOSE 3000

# Démarrage standard
CMD ["npm", "run", "start"]