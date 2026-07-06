import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const PORT = config.port;
async function main() {
  try {
    await prisma.$connect();
    console.log("Db Connected Successfully!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error in starting server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
