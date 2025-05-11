import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './lib/drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://test_owner:npg_HjUrdx3zWSK2@ep-small-poetry-a1qvkdl3-pooler.ap-southeast-1.aws.neon.tech/test?sslmode=require',
  },
})
