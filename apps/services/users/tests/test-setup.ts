import { config } from "dotenv"
import { execSync } from "node:child_process"
import { randomUUID } from "node:crypto"
import { after, before } from "node:test"
import { dirname, ExitCode } from "@commit.oi/shared"
import path from "node:path"

config({ path: path.resolve(dirname, ".env"), override: true })

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provider a DATABASE_URL environment variable")
  }

  const _url = new URL(process.env.DATABASE_URL)

  _url.searchParams.set("schema", schemaId)

  return _url.toString()
}

const schemaId = randomUUID()

before(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseUrl

  execSync("npx prisma migrate deploy")
})

import { PrismaClient } from "@commit.oi/shared"
const prisma = new PrismaClient()

after(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
  process.exit(ExitCode.SUCCESS)
})
