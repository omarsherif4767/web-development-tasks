const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const count = document.getElementById("items-left");
const filters = document.querySelectorAll("[data-filter]");
let todos = [
  { id: 1, text: "See Lecture", completed: false },
  { id: 2, text: "Solve assignment", completed: false }
];
let nextId = 3, currentFilter = "all";

function renderTodos() {
  list.innerHTML = "";
  const visible = todos.filter(todo => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });
  visible.forEach(todo => {
    const li = document.createElement("li");
    li.className = todo.completed ? "done" : "";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox"; checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => { todo.completed = checkbox.checked; renderTodos(); });
    const span = document.createElement("span");
    span.textContent = todo.text; span.title = "Double-click to edit";
    span.addEventListener("dblclick", () => {
      const editor = document.createElement("input");
      editor.type = "text"; editor.value = todo.text; span.replaceWith(editor); editor.focus();
      let saved = false;
      const save = () => {
        if (saved) return; saved = true;
        const value = editor.value.trim(); if (value) todo.text = value;
        renderTodos();
      };
      editor.addEventListener("keydown", e => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") { saved = true; renderTodos(); }
      });
      editor.addEventListener("blur", save);
    });
    const del = document.createElement("button");
    del.type = "button"; del.textContent = "🗑"; del.className = "delete-button";
    del.addEventListener("click", () => { todos = todos.filter(t => t.id !== todo.id); renderTodos(); });
    li.append(checkbox, span, del); list.appendChild(li);
  });
  count.textContent = todos.filter(t => !t.completed).length + " items left";
  filters.forEach(b => b.classList.toggle("selected", b.dataset.filter === currentFilter));
}
form.addEventListener("submit", e => {
  e.preventDefault(); const text = input.value.trim(); if (!text) return;
  todos.push({ id: nextId++, text, completed: false });
  input.value = ""; currentFilter = "all"; renderTodos(); input.focus();
});
filters.forEach(b => b.addEventListener("click", () => { currentFilter = b.dataset.filter; renderTodos(); }));
document.getElementById("clear-completed").addEventListener("click", () => { todos = todos.filter(t => !t.completed); renderTodos(); });
document.getElementById("clear-all").addEventListener("click", () => { todos = []; renderTodos(); });
renderTodos();
