FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["packages/server/package.json", "packages/server/package-lock.json*", "packages/server/npm-shrinkwrap.json*", "./"]
RUN npm install
COPY packages/server/ .
RUN npm run build
RUN npm prune --production
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]