// Drag and Drop

let draggedItem=null;


function onDragStart(event){
    draggedItem=event.target;
}

function onDragOverCol(event){
    event.currentTarget.appendChild(draggedItem);
}

// Modal functions

const btn= document.querySelector("#btn");

btn.forEach((btn)=>{
    btn.addEventListener("click",(){
        document.querySelector(btn.dataset.target).classList.add("active");
    });
}); 