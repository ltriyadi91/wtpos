FROM node:20

WORKDIR /app

# Accept build arguments
ARG DATABASE_URL

# Set environment variables
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

RUN pnpm install

COPY prisma ./prisma

# Only run migrations if DATABASE_URL is provided during build
RUN if [ -n "$DATABASE_URL" ]; then npx prisma generate; fi

# Only run seed if DATABASE_URL is provided during build
RUN if [ -n "$DATABASE_URL" ]; then npx prisma migrate reset; fi

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
