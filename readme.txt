Create the Database
yarn prisma migrate dev --name init

Generate Prisma Client
yarn prisma generate

Migrate Data
node createAdmin.ts