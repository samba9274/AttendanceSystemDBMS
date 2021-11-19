FROM node:lts-alpine AS builder
WORKDIR /app
COPY . .
ARG REACT_APP_BACKEND_SERVER
ENV REACT_APP_BACKEND_SERVER ${REACT_APP_BACKEND_SERVER}
RUN npm install
RUN npm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build/ /usr/share/nginx/html
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]