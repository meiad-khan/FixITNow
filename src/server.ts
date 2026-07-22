import { app } from "./app";
import { config } from "./config";
import { prisma } from "./lib/prisma";

const port = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Prisma connected to database successfully");
    app.listen(port, () => {
      console.log(`Fixit server is running on port ${port}`);
    })
  } catch (error) {
    console.log("Error starting the server ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();