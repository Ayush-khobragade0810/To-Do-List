// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed, task.dueDate);
    });
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(li => {
        const text = li.querySelector('span.task-text').textContent.trim();
        const dueDate = li.querySelector('span.due-date').textContent.replace('Due: ', '').trim();
        tasks.push({
            text: text,
            dueDate: dueDate,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('due-date-input');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText === '') {
        alert("Please enter a task.");
        return;
    }

    createTaskElement(taskText, false, dueDate);
    saveTasks();

    taskInput.value = '';
    dueDateInput.value = '';
}

function createTaskElement(text, completed, dueDate) {
    const taskList = document.getElementById('task-list');

    const li = document.createElement('li');
    if (completed) li.classList.add('completed');

    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = text;

    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'due-date';
    dueDateSpan.textContent = dueDate ? `Due: ${dueDate}` : '';

    // Complete task on click
    li.addEventListener('click', function() {
        li.classList.toggle('completed');
        saveTasks();
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        editTask(taskSpan, dueDateSpan);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        li.remove();
        saveTasks();
    });

    li.appendChild(taskSpan);
    li.appendChild(dueDateSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function editTask(taskSpan, dueDateSpan) {
    const newText = prompt("Edit your task:", taskSpan.textContent);
    if (newText !== null && newText.trim() !== '') {
        taskSpan.textContent = newText.trim();
    }
    const newDueDate = prompt("Edit due date (YYYY-MM-DD):", dueDateSpan.textContent.replace('Due: ', ''));
    if (newDueDate !== null) {
        dueDateSpan.textContent = newDueDate ? `Due: ${newDueDate}` : '';
    }
    saveTasks();
}

function clearAllTasks() {
    if (confirm("Are you sure you want to delete all tasks?")) {
        document.getElementById('task-list').innerHTML = '';
        localStorage.removeItem('tasks');
    }
}
