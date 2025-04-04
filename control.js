let tasks = [];

const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "completed", title: "Completed" }
];

const form = document.querySelector('#myForm');

let draggedItem = null;

function onDragStart(event) {
    draggedItem = event.target;
}

function onDragOverCol(event) {
    event.preventDefault();
    const newColumn = event.currentTarget;
    const oldColumn = draggedItem.closest('.btm-col');
    newColumn.appendChild(draggedItem);
    const newStatus = newColumn.getAttribute("data-status");
    const taskId = parseInt(draggedItem.getAttribute("data-id"), 10);
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        const oldStatus = task.status;
        task.status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTaskCounter(oldStatus);
        updateTaskCounter(newStatus);
    }
}


function updateTaskCounter(columnId) {
    const column = document.querySelector(`.col .btm-col[data-status="${columnId}"]`);
    if (!column) return;
    const taskCount = column.querySelectorAll('.card').length;
    const counterSpan = column.closest('.col').querySelector('.task-counter');
    if (counterSpan) {
        counterSpan.textContent = `(${taskCount})`;
    }
}

const overlay = document.querySelector("#overlay");
const modalId = document.querySelector("#modal-add");

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
    cardDiv.setAttribute("data-task-id", task.id);
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
    cardDiv.appendChild(cardHeaderTxtDiv);
    cardDiv.appendChild(cardSubTxtDiv);
    cardDiv.appendChild(bottomHolderDiv);
    btmColDiv.appendChild(cardDiv);
    updateTaskCounter(task.status);
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks.push(...JSON.parse(savedTasks));
        tasks.forEach(task => displayNewTask(task));
    }
    columns.forEach(column => updateTaskCounter(column.id));
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = Object.fromEntries(formData);
    newTask.tags = newTask.tags ? newTask.tags.split(',').map(tag => tag.trim()) : [];
    newTask.status = formData.get('status');
    newTask.assignees = formData.get('assignees');
    newTask.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayNewTask(newTask);
    closeModal('#modal-add');
});

function deleteTaskOnDoubleClick() {
    document.addEventListener('dblclick', (event) => {
        const cardDiv = event.target.closest('.card');
        if (!cardDiv) return;
        const taskId = parseInt(cardDiv.getAttribute('data-id'), 10);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;
        const task = tasks[taskIndex];
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        cardDiv.remove();
        updateTaskCounter(task.status);
    });
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
    const counterSpan = document.createElement("span");
    counterSpan.classList.add("task-counter");
    counterSpan.textContent = "(0)";
    typeDiv.appendChild(counterSpan);
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
    option1.onclick = () => enableInlineEdit();
    const option2 = document.createElement("div");
    option2.classList.add("tooltip-option");
    option2.textContent = "Delete Task";
    option2.onclick = () => deleteTaskOnDoubleClick();
    const option3 = document.createElement("div");
    option3.classList.add("tooltip-option");
    option3.textContent = "Clear Column";
    option3.onclick = () => clearColumn(column.id);
    tooltipMenu.appendChild(option1);
    tooltipMenu.appendChild(option2);
    tooltipMenu.appendChild(option3);
    menuContainer.appendChild(menuButton);
    menuContainer.appendChild(tooltipMenu);
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
    event.stopPropagation();
    const tooltipMenu = event.currentTarget.nextElementSibling;
    tooltipMenu.classList.toggle('visible');
}

document.addEventListener('click', () => {
    const allTooltips = document.querySelectorAll('.tooltip-menu');
    allTooltips.forEach(tooltip => tooltip.classList.remove('visible'));
});

function clearColumn(columnId) {
    const columnDiv = document.querySelector(`.col .btm-col[data-status="${columnId}"]`);
    if (!columnDiv) {
        console.error(`Column with ID "${columnId}" not found.`);
        return;
    }
    columnDiv.innerHTML = '';
    tasks = tasks.filter(task => task.status !== columnId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function enableInlineEdit() {
    document.addEventListener('dblclick', dblclickListener);
}

function openEditModal(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (!task) return;
    const modalEdit = document.querySelector('#modal-edit');
    modalEdit.querySelector('#edit-title').value = task.title;
    modalEdit.querySelector('#edit-dueDate').value = task.dueDate || '';
    modalEdit.querySelector('#edit-tags').value = task.tags ? task.tags.join(', ') : '';
    modalEdit.querySelector('#edit-status').value = task.status;
    modalEdit.querySelector('#edit-assignees').value = task.assignees || '';
    modalEdit.setAttribute('data-task-id', taskId);
    modalEdit.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function dblclickListener(event) {
    const cardHeader = event.target.closest('.card-header-txt');
    if (!cardHeader) return;
    const taskIds = parseInt(cardDiv.getAttribute('data-task-id') || cardDiv.getAttribute('data-id'), 10);
    if (!taskIds) return;
    openEditModal(taskIds);
}

function updateTask() {
    const modalEdit = document.querySelector('#modal-edit');
    const taskId = parseInt(modalEdit.getAttribute('data-task-id'), 10);
    const task = tasks.find(task => task.id === taskId);
    if (!task) return;
    const updatedTitle = modalEdit.querySelector('#edit-title').value.trim();
    const updatedDueDate = modalEdit.querySelector('#edit-dueDate').value.trim();
    const updatedTags = modalEdit.querySelector('#edit-tags').value.split(',').map(tag => tag.trim());
    const updatedStatus = modalEdit.querySelector('#edit-status').value;
    const updatedAssignees = modalEdit.querySelector('#edit-assignees').value.trim();
    task.title = updatedTitle;
    task.dueDate = updatedDueDate;
    task.tags = updatedTags;
    task.status = updatedStatus;
    task.assignees = updatedAssignees;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    const cardDiv = document.querySelector(`.card[data-id="${taskId}"]`);
    if (cardDiv) {
        const cardHeaderTxtDiv = cardDiv.querySelector('.card-header-txt');
        const tagHolderDiv = cardDiv.querySelector('.tag-holder');
        cardHeaderTxtDiv.textContent = updatedTitle;
        tagHolderDiv.innerHTML = '';
        const tagDiv = document.createElement('div');
        tagDiv.classList.add('tag');
        const img = document.createElement('img');
        img.src = "img/cal-icon.png";
        tagDiv.appendChild(img);
        tagDiv.appendChild(document.createTextNode(updatedDueDate));
        tagHolderDiv.appendChild(tagDiv);
        updatedTags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.classList.add('tag', tag.toLowerCase());
            const tagText = document.createElement('p');
            tagText.textContent = tag;
            tagElement.appendChild(tagText);
            tagHolderDiv.appendChild(tagElement);
        });
        if (task.status !== updatedStatus) {
            const newColumn = document.querySelector(`.btm-col[data-status="${updatedStatus}"]`);
            if (newColumn) {
                newColumn.appendChild(cardDiv);
            }
        }
    }
    updateTaskCounter(task.status);
    closeModal('#modal-edit');
}
