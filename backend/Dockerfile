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

# FIX: Copy admin build artifacts to 'dashboard' folder.
# Medusa builds to 'admin' by default, but our config 'path' is '/dashboard'.
# This copy ensures the server finds the files regardless of which path it checks.
RUN cp -r .medusa/server/public/admin .medusa/server/public/dashboard

# Debug: Verify the dashboard folder exists now
RUN echo "Verifying build output..." && ls -F .medusa/server/public/

# Expose port (Medusa default 9000)
EXPOSE 9000

# Start the application
# We use 'yarn start' (medusa start) because a standalone server entrypoint was not found.
# We explicitly run migrations before starting.
CMD ["sh", "-c", "npx medusa db:migrate && yarn start"]
