Create the Database
yarn prisma migrate dev --name init

Generate Prisma Client
yarn prisma generate

Migrate Data
npx prisma migrate deploy

node createAdmin.ts

node --loader ts-node/esm createAdmin.ts

yarn prisma migrate dev --name init
node --loader ts-node/esm prisma/seed.ts

npm run build
npm run start