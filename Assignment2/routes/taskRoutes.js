const express = require("express");
const { getAllTasks, addTask } = require("../controllers/taskController");

const router = express.Router();

router.get("/tasks", getAllTasks);
router.post("/add-task", addTask);

module.exports = router;
