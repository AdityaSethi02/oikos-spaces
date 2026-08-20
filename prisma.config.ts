import "dotenv/config";
import { defineConfig } from "prisma/config";

const placeholderUrl =
  "postgresql://placeholder:placeholder@localhost:5432/oikos_spaces";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? placeholderUrl,
  },
});
