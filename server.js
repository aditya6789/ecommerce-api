import express from "express";

import { APP_PORT, DB_URL } from "./config/index.js";

import router from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
import mongoose from "mongoose";

// const Port = 5000;
app.use(express.json());
app.use("/api", router);

app.use(errorHandler);

mongoose.connect(
  DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("error in connection");
    } else {
      console.log("mongodb is connected");
    }
  }
);

app.listen(APP_PORT, () => {
  console.log(`Server Connected to ${APP_PORT}`);
});
