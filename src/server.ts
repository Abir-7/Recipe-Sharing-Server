import mongoose from "mongoose";
import app from "./app";
import { config } from "./app/config";

main().catch((err) => console.log(err, "gg"));

async function main() {
  await mongoose.connect(config.mongoUri as string);

  app.listen(config.port, () => {
    console.log(
      `Example app listening on port ${config.port} & connected to mongoDb`
    );
  });
}
