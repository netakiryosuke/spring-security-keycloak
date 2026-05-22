FROM node:24.11-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ARG VITE_API_BASE_URL
ARG VITE_APP_URL
RUN npm run build

FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
