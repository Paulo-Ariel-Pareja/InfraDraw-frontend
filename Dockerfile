# Dockerfile en frontend
FROM node:24-alpine

WORKDIR /app

COPY package.json .

RUN npm install

# <-- Aceptar argumentos en build
ARG VITE_API_URL
ARG VITE_USER_ADMIN
ARG VITE_USER_PASSWORD

# <-- Pasar a entorno para que Vite los lea
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USER_ADMIN=$VITE_USER_ADMIN
ENV VITE_USER_PASSWORD=$VITE_USER_PASSWORD

COPY . .

RUN npm run build

RUN npm i -g serve

EXPOSE 8080

CMD [ "serve", "-s", "dist", "-p", "8080" ]
