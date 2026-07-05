import app from "./app";
import config from "./config";

const PORT = config.port;
async function main() {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error in starting server", error);
    process.exit(1);
  }
}

main();
