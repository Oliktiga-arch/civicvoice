FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY packages/server/package.json ./
RUN npm install
COPY packages/server/ .
RUN npx tsc
RUN npm prune --production
EXPOSE 3000
CMD ["node", "dist/index.js"]