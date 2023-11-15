ARG nodeVersion=18.18.2
ARG PROD_NODE_MODULES=/tmp/prod_node_modules

FROM node:${nodeVersion}-alpine as base

RUN apk add --no-cache --virtual .gyp python3 make g++

WORKDIR /root/app

FROM base as dependencies
ARG PROD_NODE_MODULES
COPY package.json .
COPY package-lock.json .
RUN npm ci --only=production
RUN cp -R node_modules "${PROD_NODE_MODULES}"
RUN npm ci

FROM dependencies as build
COPY . .
RUN npm run build

FROM base as release
ARG PROD_NODE_MODULES

WORKDIR /opt/app

COPY --from=dependencies /root/app/package.json .
COPY --from=build /root/app/docker-entrypoint.sh .
COPY --from=dependencies "${PROD_NODE_MODULES}" ./node_modules
COPY --from=build /root/app/dist .

RUN addgroup -S -g 10001 appGrp \
    && adduser -S -D -u 10000 -s /sbin/nologin -h /opt/app -G appGrp app\
    && chown -R 10000:10001 /opt/app

USER 10000

EXPOSE 3000

RUN ["chmod", "+x", "/opt/app/docker-entrypoint.sh"]

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]