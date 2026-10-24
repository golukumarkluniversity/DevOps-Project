FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY app ./app
COPY package.json ./package.json

RUN addgroup -S -g 10001 app && adduser -S -u 10001 -G app app
USER 10001

EXPOSE 8080
CMD ["node", "app/server.js"]
