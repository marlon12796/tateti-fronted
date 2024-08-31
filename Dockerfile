
ARG NODE_VERSION=22.3.0
ARG PNPM_VERSION=9.7.0

FROM node:${NODE_VERSION}-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app


FROM base AS build

WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
# Run the build script.
RUN pnpm run build

FROM nginxinc/nginx-unprivileged:alpine3.20-perl AS final

COPY --link nginx.conf /etc/nginx/conf.d/default.conf
COPY --link --from=build /usr/src/app/dist/tateti-fronted/browser /usr/share/nginx/html
EXPOSE ${PORT}

CMD ["nginx", "-g", "daemon off;"]
