ARG nodeVersion=18
ARG PROD_NODE_MODULES=/tmp/prod_node_modules

FROM node:${nodeVersion}-alpine as base

WORKDIR /root/app

FROM base as dependencies
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

ARG PROD_NODE_MODULES
COPY package*.json .
RUN npm ci --only=production
RUN cp -R node_modules "${PROD_NODE_MODULES}"
RUN npm install

FROM dependencies as build
COPY . .
RUN npm run build

FROM base as release

ARG PROD_NODE_MODULES

WORKDIR /opt/app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=dependencies --chown=nestjs:nodejs /root/app/package.json .
COPY --from=build --chown=nestjs:nodejs /root/app/docker-entrypoint.sh .
COPY --from=dependencies --chown=nestjs:nodejs "${PROD_NODE_MODULES}" ./node_modules
COPY --from=build --chown=nestjs:nodejs /root/app/dist .

USER nestjs

EXPOSE 3001

RUN ["chmod", "+x", "/opt/app/docker-entrypoint.sh"]

CMD ["sh", "./docker-entrypoint.sh"]