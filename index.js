const form = document.getElementById("form");
const todoInput = document.getElementById("todo-input");
const todoItemContainer = document.getElementById("todo-item-container");
const heroButton = document.getElementById("hero-button");
const mainContainer = document.getElementById("main-container");
const trialButton = document.getElementById("trial-button");
const closeIcon = document.getElementById("close-icon");

let todoItemsArray = [];
let editingSignal = -1;

// Reveal the Todo Container
heroButton.addEventListener("click", revealTodoContainer);
trialButton.addEventListener("click", revealTodoContainer);
closeIcon.addEventListener("click", closeTodoContainer);

function revealTodoContainer() {
    mainContainer.classList.remove("main-container");
    mainContainer.classList.add("main-container-visible");
}

function closeTodoContainer() {
    mainContainer.classList.remove("main-container-visible");
    mainContainer.classList.add("main-container");
}

// Fetch Todo Items from Local Storage
function fetchTodoItems() {
    try {
        const storedTodos = localStorage.getItem("todos");
        todoItemsArray = storedTodos ? JSON.parse(storedTodos) : [];
    } catch (error) {
        console.error("Error parsing local storage data:", error);
        todoItemsArray = [];
    }
    showTodosOnUI();
}
fetchTodoItems();

// Show Todo Items on UI
function showTodosOnUI() {
    todoItemContainer.innerHTML = ""; // Clear container
    todoItemsArray.forEach((todoItem, index) => {
        const todoItemDiv = document.createElement("div");
        todoItemDiv.classList.add("todo-item");
        todoItemDiv.setAttribute("id", `${index}`);
        todoItemDiv.setAttribute("role", "listitem");
        todoItemDiv.setAttribute("aria-label", `Task ${index + 1}`);

        // Left Side
        const leftSideDiv = document.createElement("div");
        leftSideDiv.classList.add("left-side");

        const icon = document.createElement("i");
        icon.classList.add(
            "fa",
            todoItem.completed ? "fa-circle-check" : "fa-circle"
        );
        icon.setAttribute("data-action", "check");

        const todoText = document.createElement("p");
        todoText.textContent = todoItem.todoItemEntered;
        todoText.setAttribute("data-action", "check");
        if (todoItem.completed) {
            todoText.style.textDecoration = "line-through";
        }

        leftSideDiv.append(icon, todoText);

        // Right Side
        const rightSideDiv = document.createElement("div");
        rightSideDiv.classList.add("right-side");

        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-solid", "fa-pen");
        editIcon.setAttribute("data-action", "edit");

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash");
        deleteIcon.setAttribute("data-action", "delete");

        rightSideDiv.append(editIcon, deleteIcon);

        // Append to Main Div
        todoItemDiv.append(leftSideDiv, rightSideDiv);
        todoItemContainer.append(todoItemDiv);
    });
}

// Handle Form Submit
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const todoInputValue = todoInput.value.trim();

    if (!todoInputValue) {
        alert("Enter a Todo Item");
        return;
    }

    if (editingSignal >= 0) {
        // Edit existing todo
        todoItemsArray[editingSignal].todoItemEntered = todoInputValue;
        editingSignal = -1;
    } else {
        // Add new todo
        todoItemsArray.push({
            todoItemEntered: todoInputValue,
            completed: false,
        });
    }

    localStorage.setItem("todos", JSON.stringify(todoItemsArray));
    form.reset();
    showTodosOnUI();
});

// Handle Click Events on Todo Items
todoItemContainer.addEventListener("click", (event) => {
    const target = event.target;
    const parentDiv = target.closest(".todo-item");
    if (!parentDiv) return;

    const todoID = Number(parentDiv.id);
    const action = target.dataset.action;

    if (action === "check") {
        toggleComplete(todoID);
    } else if (action === "edit") {
        editTodoItem(todoID);
    } else if (action === "delete") {
        deleteTodoItem(todoID);
    }
});

// Toggle Complete Status
function toggleComplete(ID) {
    todoItemsArray[ID].completed = !todoItemsArray[ID].completed;
    localStorage.setItem("todos", JSON.stringify(todoItemsArray));
    showTodosOnUI();
}

// Edit Todo Item
function editTodoItem(ID) {
    todoInput.value = todoItemsArray[ID].todoItemEntered;
    editingSignal = ID;
}

// Delete Todo Item
function deleteTodoItem(ID) {
    todoItemsArray.splice(ID, 1);
    localStorage.setItem("todos", JSON.stringify(todoItemsArray));
    showTodosOnUI();
}
