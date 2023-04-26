const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const { readdirSync } = require("fs");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log(`DB CONNECTED`))
  .catch((err) => console.log(`DB CONNECTION ERROR: ${err}`));

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

readdirSync("./routes").map((route) =>
  app.use("/api", require("./routes/" + route))
);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`SERVER IS RUNNING ON PORT ${port}`);
});
