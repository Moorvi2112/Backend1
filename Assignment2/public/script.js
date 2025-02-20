document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskDate = document.getElementById("task-date");
    const taskList = document.getElementById("task-list");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = "task-item";
            li.innerHTML = `
                <span class="${task.completed ? "completed" : ""}">${task.title} (Due: ${task.date})</span>
                <div class="task-actions">
                    <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.completed ? "checked" : ""}>
                    <button class="edit-btn" data-index="${index}">✏️</button>
                    <button class="delete-btn" data-index="${index}">🗑️</button>
                </div>
            `;
            taskList.appendChild(li);
        });
        saveTasks();
        attachEventListeners();
    }

    function addTask(e) {
        e.preventDefault();
        tasks.push({ title: taskInput.value, date: taskDate.value, completed: false });
        taskInput.value = "";
        taskDate.value = "";
        renderTasks();
    }

    function attachEventListeners() {
        document.querySelectorAll(".task-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", e => {
                tasks[e.target.dataset.index].completed = e.target.checked;
                renderTasks();
            });
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                const index = e.target.dataset.index;
                taskInput.value = tasks[index].title;
                taskDate.value = tasks[index].date;
                
                taskForm.querySelector(".add-btn").textContent = "Update";
                taskForm.onsubmit = (event) => {
                    event.preventDefault();
                    tasks[index] = { title: taskInput.value, date: taskDate.value, completed: tasks[index].completed };
                    taskInput.value = "";
                    taskDate.value = "";
                    taskForm.querySelector(".add-btn").textContent = "Add";
                    taskForm.onsubmit = addTask;
                    renderTasks();
                };
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                tasks.splice(e.target.dataset.index, 1);
                renderTasks();
            });
        });
    }

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }

    taskForm.addEventListener("submit", addTask);
    renderTasks();
});
