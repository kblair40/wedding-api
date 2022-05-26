const express = require("express");
const app = express();

// replacement for body-parser which shouldn't be needed in express 4.16+
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TEST PASSED!");
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
