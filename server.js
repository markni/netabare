const express = require("express");
const app = express();
const path = require("path");

console.log(path.join(__dirname, "dist"));
app.use("/", express.static(path.join(__dirname, "dist")));

app.listen(8777, () => console.log("Netaba.re server is up at port 8777."));
