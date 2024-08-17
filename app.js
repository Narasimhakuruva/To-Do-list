let tasks = [];
let editingTaskIndex = -1; // To keep track of which task is being edited
const totalTasks = 10; // Set the total number of tasks to 10

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();

    if (text && tasks.length < totalTasks) {
        if (editingTaskIndex >= 0) {
            // Update the task if we're in edit mode
            tasks[editingTaskIndex].text = text;
            editingTaskIndex = -1; // Reset after editing
        } else {
            // Add a new task
            tasks.push({ text: text, completed: false });
        }
        taskInput.value = "";
        updateTasksList();
        updateStats();
    }
};

const updateTasksList = () => {
    const taskLists = document.querySelector('.task-list');
    taskLists.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
        <div class="taskItem">
           <div class="task ${task.completed ? 'completed' : ''}">
              <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}/>
              <p>${task.text}</p>
           </div>
           <div class="icons">
               <img src="edit.png" alt="" class="edit-icon" onClick="editTask(${index})"/>
               <img src="delete.png" alt="" class="delete-icon" onClick="deleteTask(${index})"/>
           </div>
        </div>
        `;
        listItem.querySelector('.checkbox').addEventListener("change", () => toggleTaskComplete(index));
        taskLists.append(listItem);
    });
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
};

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text; // Load the task text into the input field
    editingTaskIndex = index; // Store the index of the task being edited
    taskInput.focus(); // Focus on the input field
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalCurrentTasks = tasks.length; // Current number of tasks

    document.querySelector('.progress').style.width = `${(completedTasks / totalTasks) * 100}%`;
    document.querySelector('.stats-number').innerText = `${completedTasks}/${totalTasks}`;

    // Check if all tasks are completed
    if (completedTasks === totalCurrentTasks && completedTasks === totalTasks) {
        // Trigger confetti after a short delay
        setTimeout(triggerConfetti, 500);
    }
};

const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#bb0000', '#ffffff'];

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    (function frame() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return;
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
            particleCount,
            startVelocity: 30,
            spread: 360,
            origin: {
                x: randomInRange(0.1, 0.3),
                y: Math.random() - 0.2
            },
            colors: colors
        });

        requestAnimationFrame(frame);
    }());
};

document.getElementById('newTask').addEventListener("click", function(e) {
    e.preventDefault();
    addTask();
    updateStats();
});

updateStats(); // Initialize the stats to 0/10
