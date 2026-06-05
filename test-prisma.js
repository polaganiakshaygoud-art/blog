const { PrismaClient } = require('@prisma/client');
async function main() {
  try {
    console.log("Creating client without adapter...");
    const prisma = new PrismaClient();
    const posts = await prisma.post.findMany();
    console.log(posts.length);
  } catch (err) {
    console.error("Error 1:", err);
  }

  try {
    console.log("Creating client with adapter...");
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
    const Database = require('better-sqlite3');
    const sqlite = new Database('./dev.db');
    const adapter = new PrismaBetterSqlite3(sqlite);
    const prisma2 = new PrismaClient({ adapter });
    const posts2 = await prisma2.post.findMany();
    console.log(posts2.length);
  } catch (err) {
    console.error("Error 2:", err);
  }
}
main();
