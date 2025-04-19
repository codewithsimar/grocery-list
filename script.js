document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskModal = document.getElementById("taskModal");
  const closeModalBtn = document.getElementById("closeModal");
  const taskForm = document.getElementById("taskForm");
  const columns = document.querySelectorAll(".column");
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const dueDateInput = document.getElementById("dueDate");
  const priorityInput = document.getElementById("priority");

  const statusColors = {
    'to-buy': '#facc15',       // yellow
    'in-cart': '#60a5fa',      // blue
    'purchased': '#34d399'     // green
  };

  let tasks = JSON.parse(localStorage.getItem("groceryList")) || [];

  function openModal() {
    taskModal.classList.add("show");
  }

  function closeModal() {
    taskModal.classList.remove("show");
    taskForm.reset();
  }

  function saveTasks() {
    localStorage.setItem("groceryList", JSON.stringify(tasks));
  }

  function renderTasks() {
    document.querySelectorAll(".task-list").forEach(list => list.innerHTML = "");

    tasks.forEach(task => {
      const taskEl = document.createElement("div");
      taskEl.className = "task";
      taskEl.draggable = true;
      taskEl.dataset.id = task.id;
      taskEl.style.backgroundColor = statusColors[task.status];
      taskEl.innerHTML = `
        <strong>${task.title}</strong><br>
        <small>${task.description}</small><br>
        <small>Need by: ${task.dueDate}</small>
      `;
      document.getElementById(task.status).appendChild(taskEl);
    });
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      title: titleInput.value,
      description: descriptionInput.value,
      dueDate: dueDateInput.value,
      priority: priorityInput.value,
      status: "to-buy"
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    closeModal();
  });

  addTaskBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);

  columns.forEach(column => {
    const taskList = column.querySelector(".task-list");

    taskList.addEventListener("dragover", (e) => {
      e.preventDefault();
      taskList.style.background = "#e0e7ff";
    });

    taskList.addEventListener("dragleave", () => {
      taskList.style.background = "";
    });

    taskList.addEventListener("drop", (e) => {
      e.preventDefault();
      taskList.style.background = "";

      const id = e.dataTransfer.getData("text/plain");
      const task = tasks.find(t => t.id == id);
      if (task) {
        task.status = taskList.id;
        saveTasks();
        renderTasks();
      }
    });
  });

  document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("task")) {
      e.dataTransfer.setData("text/plain", e.target.dataset.id);
    }
  });

  renderTasks();
});
