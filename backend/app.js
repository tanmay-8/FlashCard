const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api", require("./routers"));


const start = async () => {
    // await db.createTables();

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

start();
