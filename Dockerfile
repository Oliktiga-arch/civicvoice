FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["packages/server/package.json", "packages/server/package-lock.json*", "packages/server/npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY packages/server/ .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]