const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

async function main() {
  try {
    console.log("Creating client with new adapter API...");
    const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
    const prisma = new PrismaClient({ adapter });
    const posts = await prisma.post.findMany();
    console.log(posts.length);
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
