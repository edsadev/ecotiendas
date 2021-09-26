FROM node:13.12.0-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY ./frontend .
RUN npm run build

FROM nginx:stable-alpine

COPY deployment/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]