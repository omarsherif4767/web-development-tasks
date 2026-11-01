
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const form = document.getElementById("todo-form") as HTMLFormElement;
const input = document.getElementById("todo-input") as HTMLInputElement;
const list = document.getElementById("todo-list") as HTMLUListElement;
const count = document.getElementById("items-left") as HTMLSpanElement;
const filters = document.querySelectorAll<HTMLButtonElement>("[data-filter]");

let todos: Todo[] = [
  { id: 1, text: "See Lecture", completed: false },
  { id: 2, text: "Solve assignment", completed: false }
];

let nextId: number = 3;
let currentFilter: string = "all";

function renderTodos(): void {
  list.innerHTML = "";

  const visible: Todo[] = todos.filter((todo: Todo): boolean => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  visible.forEach((todo: Todo): void => {
    const li = document.createElement("li");
    li.className = todo.completed ? "done" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    checkbox.addEventListener("change", (): void => {
      todo.completed = checkbox.checked;
      renderTodos();
    });

    const span = document.createElement("span");
    span.textContent = todo.text;
    span.title = "Double-click to edit";

    span.addEventListener("dblclick", (): void => {
      const editor = document.createElement("input");
      editor.type = "text";
      editor.value = todo.text;

      span.replaceWith(editor);
      editor.focus();

      let saved = false;

      const save = (): void => {
        if (saved) return;
        saved = true;

        const value: string = editor.value.trim();
        if (value) todo.text = value;

        renderTodos();
      };

      editor.addEventListener("keydown", (e: KeyboardEvent): void => {
        if (e.key === "Enter") save();

        if (e.key === "Escape") {
          saved = true;
          renderTodos();
        }
      });

      editor.addEventListener("blur", save);
    });

    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "🗑";
    del.className = "delete-button";

    del.addEventListener("click", (): void => {
      todos = todos.filter((t: Todo): boolean => t.id !== todo.id);
      renderTodos();
    });

    li.append(checkbox, span, del);
    list.appendChild(li);
  });

  count.textContent =
    todos.filter((t: Todo): boolean => !t.completed).length + " items left";

  filters.forEach((b: HTMLButtonElement): void => {
    b.classList.toggle("selected", b.dataset.filter === currentFilter);
  });
}

form.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();

  const text: string = input.value.trim();
  if (!text) return;

  todos.push({
    id: nextId++,
    text,
    completed: false
  });

  input.value = "";
  currentFilter = "all";

  renderTodos();
  input.focus();
});

filters.forEach((b: HTMLButtonElement): void => {
  b.addEventListener("click", (): void => {
    currentFilter = b.dataset.filter ?? "all";
    renderTodos();
  });
});

document.getElementById("clear-completed")!.addEventListener("click", (): void => {
  todos = todos.filter((t: Todo): boolean => !t.completed);
  renderTodos();
});

document.getElementById("clear-all")!.addEventListener("click", (): void => {
  todos = [];
  renderTodos();
});

renderTodos();
