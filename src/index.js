const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// APP NAME = DRY-CHAMBER-32067

const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

require("./models");

const routes = require("./routes");

const app = express();

// replacement for body-parser which shouldn't be needed in express 4.16+
app.use(express.json());
app.use(cors());
app.use(routes);

const mongoUri = `mongodb+srv://kblair40:${MONGO_PASSWORD}@cluster0.uq0gzun.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoUri, { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.log("CONNECTED TO MONGO INSTANCE");
});
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", (req, res) => {
  res.status(200).send("200 - OK");
});

app.listen(process.env.PORT || 3001, () => console.log("Server is running..."));
