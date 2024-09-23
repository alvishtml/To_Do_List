// Initialize tasks array from localStorage or create an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

// Load existing tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    updateTaskList();
});

// Add new task
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const taskName = document.getElementById('taskName').value;
    const taskCategory = document.getElementById('taskCategory').value;
    const taskDeadline = document.getElementById('taskDeadline').value;

    const newTask = { name: taskName, category: taskCategory, deadline: taskDeadline, completed: false };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('taskName').value = '';
    document.getElementById('taskCategory').value = 'Work';
    document.getElementById('taskDeadline').value = '';

    updateTaskList();
});

// Update task list in the UI
function updateTaskList() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        
        // Task name and category
        listItem.innerHTML = `
            <span>${task.name}</span>
            <span class="category ${task.category}">${task.category}</span>
        `;

        // Task deadline with visual warning if it's near, only if task is not completed
        if (!task.completed) {
            const today = new Date();
            const deadlineDate = new Date(task.deadline);
            const timeDiff = deadlineDate - today;
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            let deadlineText = `${task.deadline}`;
            if (daysDiff <= 3 && daysDiff >= 0) {
                deadlineText = `<span class="deadline-warning">⚠️ ${task.deadline} (Due Soon!)</span>`;
            } else if (daysDiff < 0) {
                deadlineText = `<span class="deadline-warning">❗ ${task.deadline} (Overdue!)</span>`;
            }

            listItem.innerHTML += `<span>${deadlineText}</span>`;
        } else {
            listItem.innerHTML += `<span>Completed</span>`;
        }

        // Complete and delete buttons
        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Completed' : 'Complete';
        completeButton.onclick = () => toggleTaskCompletion(index);
        listItem.appendChild(completeButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(index);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
}

// Toggle task completion
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskList();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskList();
}
