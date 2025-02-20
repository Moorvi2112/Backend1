const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const taskRoutes = require("./routes/taskRoutes");
const logger = require("./middleware/logger");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(logger);

app.set("view engine", "ejs");
app.set("views", "views");

const tasksFile = path.join(__dirname, "tasks.json");
if (!fs.existsSync(tasksFile)) fs.writeFileSync(tasksFile, "[]");

app.get("/", (req, res) => {
    const tasks = JSON.parse(fs.readFileSync(tasksFile, "utf8"));
    res.render("index", { tasks });
});

app.use("/", taskRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
