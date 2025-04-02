// declare variables

let tasks = [];


const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "completed", title: "Completed" }
];

const form = document.querySelector('#myForm');


// Drag and Drop functionality

let draggedItem=null;

function onDragStart(event) {
    draggedItem = event.target;
}

function onDragOverCol(event) {
    event.preventDefault(); // prevent default behavior to allow drop
    const newColumn = event.currentTarget;
    newColumn.appendChild(draggedItem);

    // update the status of the task in the tasks array
    const newStatus = newColumn.getAttribute("data-status");
    const taskId = parseInt(draggedItem.getAttribute("data-id"), 10);

    // find the task in the tasks array and update its status
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.status = newStatus;

        // save to local storage    
        localStorage.setItem('tasks', JSON.stringify(tasks));
        console.log(`Task ID ${taskId} status updated to: ${newStatus}`);
    }
}

// Modal functionality


const overlay=document.querySelector("#overlay");
const modalId= document.querySelector("#modal-add");

function openModal(modalId) {
    document.querySelector(modalId).style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModal(modalId) {
    document.querySelector(modalId).style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    const form = document.querySelector('#myForm');
    if (form) form.reset();
}

//show new task upon creation

function displayNewTask(task) {
    const column = columns.find(column => column.id === task.status);
    if (!column) return;

    const btmColDiv = document.querySelector(`.col .btm-col[data-status="${task.status}"]`);
    if (!btmColDiv) return;

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.setAttribute("draggable", "true");
    cardDiv.setAttribute("ondragstart", "onDragStart(event)");
    cardDiv.setAttribute("data-id", task.id); 

    const cardHeaderTxtDiv = document.createElement("div");
    cardHeaderTxtDiv.classList.add("card-header-txt");
    cardHeaderTxtDiv.textContent = task.title;

    const cardSubTxtDiv = document.createElement("div");
    cardSubTxtDiv.classList.add("card-sub-txt");

    const bottomHolderDiv = document.createElement("div");
    bottomHolderDiv.classList.add("bottom-holder");

    const tagHolderDiv = document.createElement("div");
    tagHolderDiv.classList.add("tag-holder");

    const tagDiv = document.createElement("div");
    tagDiv.classList.add("tag");

    const img = document.createElement("img");
    img.src = "img/cal-icon.png";

    tagDiv.appendChild(img);
    tagDiv.appendChild(document.createTextNode(task.dueDate));
    tagHolderDiv.appendChild(tagDiv);

    bottomHolderDiv.appendChild(tagHolderDiv);

    task.tags.forEach(tag => {
        const tagHolder = document.createElement("div");
        tagHolder.classList.add("tag-holder");

        const tagElement = document.createElement("div");
        tagElement.classList.add("tag", tag.toLowerCase());

        const tagText = document.createElement("p");
        tagText.textContent = tag;

        tagElement.appendChild(tagText);
        tagHolder.appendChild(tagElement);
        bottomHolderDiv.appendChild(tagHolder);
    });

/*     const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => deleteTask(task.id));  */

    cardDiv.appendChild(cardHeaderTxtDiv);
    cardDiv.appendChild(cardSubTxtDiv);
    cardDiv.appendChild(bottomHolderDiv);

    btmColDiv.appendChild(cardDiv);
}




// load tasks from localStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks.push(...JSON.parse(savedTasks)); // push new task to array
        tasks.forEach(task => displayNewTask(task)); // display task
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = Object.fromEntries(formData);
    newTask.tags = newTask.tags ? newTask.tags.split(',').map(tag => tag.trim()) : [];
    newTask.status = formData.get('status');
    newTask.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1; 
    tasks.push(newTask);

    // save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    displayNewTask(newTask);
    console.log("Task added:", newTask);
    closeModal('#modal-add');
});


function deleteTask(taskId) {
    //find the array index of the item to delete
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    //remove task from array
    tasks.splice(taskIndex, 1);

    // save new array to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    //remove card from dom
    const taskCard = document.querySelector(`.card[data-id="${taskId}"]`);
    if (taskCard) {
        taskCard.remove();
    }

    console.log(`Task with ID ${taskId} deleted.`);
}


const kanbanColumns = document.getElementById("kanban-columns");

columns.forEach(column => {
    const columnDiv = document.createElement("div");
    columnDiv.classList.add("col");

    const topColDiv = document.createElement("div");
    topColDiv.classList.add("top-col");

    const typeDiv = document.createElement("div");
    typeDiv.classList.add("type");
    typeDiv.textContent = column.title;

    const menuContainer = document.createElement("div");
    menuContainer.classList.add("menu-container");

    const menuButton = document.createElement("button");
    menuButton.classList.add("menu-btn");
    menuButton.textContent = ". . .";
    menuButton.onclick = toggleTooltip; 

    const tooltipMenu = document.createElement("div");
    tooltipMenu.classList.add("tooltip-menu", "hidden");

    const option1 = document.createElement("div");
    option1.classList.add("tooltip-option");
    option1.textContent = "Edit Task";
    option1.onclick = () => console.log(`Add Task clicked in ${column.title}`);

    const option2 = document.createElement("div");
    option2.classList.add("tooltip-option");
    option2.textContent = "Delete Task";
    option2.onclick = () => console.log(`Edit Column clicked in ${column.title}`);

    const option3 = document.createElement("div");
    option3.classList.add("tooltip-option");
    option3.textContent = "Clear Column";
    option3.onclick = () => clearColumn(column.id);
    //add options to tooltip menu
    tooltipMenu.appendChild(option1);
    tooltipMenu.appendChild(option2);
    tooltipMenu.appendChild(option3);

    // add the menu button and tooltip to the menu container
    menuContainer.appendChild(menuButton);
    menuContainer.appendChild(tooltipMenu);
    //add the menu to the container
    topColDiv.appendChild(typeDiv);
    topColDiv.appendChild(menuContainer);

    const btmColDiv = document.createElement("div");
    btmColDiv.classList.add("btm-col");
    btmColDiv.setAttribute("ondragover", "onDragOverCol(event)");
    btmColDiv.setAttribute("data-status", column.id);

    columnDiv.appendChild(topColDiv);
    columnDiv.appendChild(btmColDiv);

    kanbanColumns.appendChild(columnDiv);
});

function toggleTooltip(event) {
    event.stopPropagation(); // prevent click from going outside doc
    const tooltipMenu = event.currentTarget.nextElementSibling; // get tooltip
    tooltipMenu.classList.toggle('visible'); // toggle visibility
}

// close when clicking outside the tooltip
document.addEventListener('click', () => {
    const allTooltips = document.querySelectorAll('.tooltip-menu');
    allTooltips.forEach(tooltip => tooltip.classList.remove('visible'));
});

function clearColumn(columnId) {
    // find column in dom, then remove all tasks from the columns' DOM.
    const columnDiv = document.querySelector(`.col .btm-col[data-status="${columnId}"]`);
    if (!columnDiv) {
        console.error(`Column with ID "${columnId}" not found.`);
        return;
    }
    columnDiv.innerHTML = '';
    tasks = tasks.filter(task => task.status !== columnId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

