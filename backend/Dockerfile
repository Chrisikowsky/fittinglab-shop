FROM node:20-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies (frozen lockfile for speed/consistency)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Fix: Rename admin build directory to match 'path: "/dashboard"' in config
# Medusa build defaults to 'admin', but we need 'dashboard' to avoid reserved route conflicts
RUN if [ -d ".medusa/server/public/admin" ]; then \
    mv .medusa/server/public/admin .medusa/server/public/dashboard; \
    fi

# Debug: List build artifacts to confirm dashboard files exist
RUN echo "Checking build output..." && ls -R .medusa

# Expose port (Medusa default 9000)
EXPOSE 9000

# Start the application
CMD ["yarn", "start"]
