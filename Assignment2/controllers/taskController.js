const fs = require("fs");
const path = require("path");

const TASKS_FILE = path.join(__dirname, "../tasks.json");

const readTasks = () => fs.existsSync(TASKS_FILE) ? JSON.parse(fs.readFileSync(TASKS_FILE, "utf8")) : [];

const writeTasks = (tasks) => fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));

const getAllTasks = (req, res) => res.json(readTasks());

const addTask = (req, res) => {
    const tasks = readTasks();
    tasks.push({ id: tasks.length + 1, title: req.body.title, completed: false });
    writeTasks(tasks);
    res.redirect("/");
};

const toggleTask = (req, res) => {
    const tasks = readTasks().map(task => task.id == req.params.id ? { ...task, completed: !task.completed } : task);
    writeTasks(tasks);
    res.sendStatus(200);
};

const deleteTask = (req, res) => {
    writeTasks(readTasks().filter(task => task.id != req.params.id));
    res.sendStatus(200);
};

module.exports = { getAllTasks, addTask, toggleTask, deleteTask };
