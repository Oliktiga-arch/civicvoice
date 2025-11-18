FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY packages/server/package.json packages/server/package-lock.json ./
RUN npm ci --include=dev
COPY packages/server/ .
RUN npm prune --production
EXPOSE 3000
CMD ["node", "src/index.js"]