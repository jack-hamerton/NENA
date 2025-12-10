# build environment
FROM node:18-alpine as build
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY frontend/nginx.prod.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
