# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.16.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="SvelteKit/Prisma"

# SvelteKit/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Install node modules
COPY --link .npmrc package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY --link . .

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# Generate Prisma Client
COPY --link prisma .
ENV DATABASE_URL="file:///data/sqlite.db"
#RUN npx prisma generate

# Build application
RUN npm run build
RUN npx prisma db push 


# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives


# Copy built application
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app
COPY --from=build /app/docker-entrypoint.js /app
COPY --from=build /app/prisma /app/prisma

# Entrypoint prepares the database.
#ENTRYPOINT [ "/app/docker-entrypoint.js" ]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "./build/index.js" ]
