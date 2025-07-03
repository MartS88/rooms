FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install development dependencies
FROM base AS install
WORKDIR /temp/dev
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Install production dependencies
FROM base AS prod-deps
WORKDIR /temp/prod
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Build the project
FROM base AS build
WORKDIR /usr/src/app
COPY --from=install /temp/dev/node_modules ./node_modules
COPY . .
RUN bun run build

# Final image
FROM base AS release
WORKDIR /usr/src/app
COPY --from=prod-deps /temp/prod/node_modules ./node_modules
COPY --from=build /usr/src/app ./

# Automatically run migrations, seed the database, and start the dev server
CMD ["sh", "-c", "bun run migrate && bun run seed-all && bun run dev"]
