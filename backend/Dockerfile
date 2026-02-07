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
# We keep this as a safeguard, although running from .medusa/server might solve pathing.
RUN cp -r .medusa/server/public/admin .medusa/server/public/dashboard

# Debug: Verifying build output
RUN echo "Verifying build output..." && ls -F .medusa/server/

# Expose port (Medusa default 9000)
EXPOSE 9000

# Start the application - Variant B (User Suggestion)
# We change directory to the built server artifact and run from there.
# We also attempt to create a default admin user (ignoring error if exists) to simplify setup.
CMD ["sh", "-lc", "cd .medusa/server && npx medusa db:migrate && (npx medusa user --email admin@fittinglab.com --password supersecret || true) && npm run start"]
