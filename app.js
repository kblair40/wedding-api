const express = require("express");
const mongoPwd = require("./ignore");
const mongoose = require("mongoose");

const app = express();

// replacement for body-parser which shouldn't be needed in express 4.16+
app.use(express.json());

const mongoUri = `mongodb+srv://kblair40:${mongoPwd}@cluster0.gwipufa.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoUri, { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.log("CONNECTED TO MONGO INSTANCE");
});
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", (req, res) => {
  res.send("TEST PASSED!");
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
