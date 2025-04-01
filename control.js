let draggedItem=null;


function onDragStart(event){
    draggedItem=event.target;
}

function onDragOverCol(event){
    event.currentTarget.appendChild(draggedItem);
}