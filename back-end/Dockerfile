FROM node:24

WORKDIR /app

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npm install

COPY . .

COPY .env .env

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

# Start server
CMD [ "node", "dist/main.js" ]

