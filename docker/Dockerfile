FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY app ./app
COPY package.json ./package.json

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 8080
CMD ["node", "app/server.js"]
