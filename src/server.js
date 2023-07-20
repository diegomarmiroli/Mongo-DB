const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => console.log(`Example app listening on port ${process.env.SERVER_PORT}!`));
