import { app } from "./app";

async function main() {
  try {
    app.listen(3000, () => {
      console.log(`Fixit server is running on port ${3000}`);
    })
  } catch (error) {
    console.log("Error starting the server ", error);
  }
}
main();