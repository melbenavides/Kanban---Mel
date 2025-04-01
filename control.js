// Drag and Drop

let draggedItem=null;


function onDragStart(event){
    draggedItem=event.target;
}

function onDragOverCol(event){
    event.currentTarget.appendChild(draggedItem);
}

// Modal functions

const overlay=document.querySelector("#overlay");


function openModal(modalId) {
    document.querySelector(modalId).style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModal(modalId) {
    document.querySelector(modalId).style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

/* // Save input as JSON
function showResult() {
    const form = document.querySelector('#myForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const formData = new FormData(form); 
        const obj = Object.fromEntries(formData); 
        console.log(obj);
    });
} */

function saveTask() {
    const form = document.querySelector('#myForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newTask = Object.fromEntries(formData);
        newTask.tags = newTask.tags ? newTask.tags.split(',').map(tag => tag.trim()) : [];
        newTask.status = "todo"; // Default status for new tasks
        tasks.push(newTask);
        console.log("Task added:", newTask);
    });
}

function displayNewTask(task) {
    const column = columns.find(col => col.id === task.status);
    if (!column) return;

    const btmColDiv = document.querySelector(`.col .btm-col[ondragover="onDragOverCol(event)"]`);
    if (!btmColDiv) return;

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.setAttribute("draggable", "true");
    cardDiv.setAttribute("ondragstart", "onDragStart(event)");

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
}

document.querySelector('#myForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = Object.fromEntries(formData);
    newTask.tags = newTask.tags ? newTask.tags.split(',').map(tag => tag.trim()) : [];
    newTask.status = "todo"; // Default status for new tasks
    tasks.push(newTask);
    displayNewTask(newTask);
    console.log("Task added:", newTask);
});


const tasks = [
    { title: "Finish user onboarding", dueDate: "Tomorrow", tags: [], status: "todo" },
    { title: "Solve the dribble prioritization issue with the team", dueDate: "Jan 8, 2027", tags: ["Marketing"], status: "todo" },
    { title: "Change license and remove products", dueDate: "Jan 8, 2027", tags: ["Dev"], status: "todo" },
    { title: "Work In Progress (WIP) Dashboard", dueDate: "Today", tags: [], status: "inprogress" },
    { title: "Kanban Flow Manager", dueDate: "Feb 12, 2027", tags: ["Template"], status: "inprogress" },
    { title: "Product Update - Q4 2024", dueDate: "Feb 12, 2017", tags: [], status: "inprogress" },
    { title: "Make figbot send comment when ticket is auto-moved back to inbox", dueDate: "Mar 08, 2027", tags: [], status: "inprogress" },
    { title: "Manage internal feedback", dueDate: "Tomorrow", tags: [], status: "completed" },
    { title: "Do some projects on React Native with Flutter", dueDate: "Jan 8, 2027", tags: ["Development"], status: "completed" },
    { title: "Design Marketing assets", dueDate: "Jan 8, 2027", tags: [], status: "completed" },
    { title: "Kanban Flow Manager", dueDate: "Feb 12, 2027", tags: [], status: "completed" }
];


const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "completed", title: "Completed" }
];

const kanbanColumns = document.getElementById("kanban-columns");

columns.forEach(column => {
    const columnDiv = document.createElement("div");
    columnDiv.classList.add("col");

    const topColDiv = document.createElement("div");
    topColDiv.classList.add("top-col");

    const typeDiv = document.createElement("div");
    typeDiv.classList.add("type");
    typeDiv.textContent = column.title;

    const menuDiv = document.createElement("div");
    menuDiv.classList.add("menu");
    menuDiv.textContent = ". . .";

    topColDiv.appendChild(typeDiv);
    topColDiv.appendChild(menuDiv);

    const btmColDiv = document.createElement("div");
    btmColDiv.classList.add("btm-col");
    btmColDiv.setAttribute("ondragover", "onDragOverCol(event)");

    tasks.filter(task => task.status === column.id).forEach(task => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.setAttribute("draggable", "true");
        cardDiv.setAttribute("ondragstart", "onDragStart(event)");

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
    });

    columnDiv.appendChild(topColDiv);
    columnDiv.appendChild(btmColDiv);

    kanbanColumns.appendChild(columnDiv);
});



