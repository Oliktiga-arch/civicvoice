FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY packages/server/package.json ./
RUN npm install --include=dev
COPY packages/server/ .
RUN npm prune --production
EXPOSE 3000
CMD ["node", "src/index.js"]