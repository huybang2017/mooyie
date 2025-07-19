FROM node:20

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npm install

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

EXPOSE 3000

# Start server
CMD [ "node", "dist/main.js" ]

