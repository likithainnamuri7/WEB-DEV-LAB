import React from "react";

function TaskItem({
  todo,
  toggleTodo,
  deleteTodo,
}) {
  return (
    <div className="task-item">

      <span
        className={todo.completed ? "completed" : ""}
        onClick={() => toggleTodo(todo)}
      >
        {todo.task}
      </span>

      <button onClick={() => toggleTodo(todo)}>
        {todo.completed ? "Undo" : "Done"}
      </button>

      <button onClick={() => deleteTodo(todo._id)}>
        Delete
      </button>

    </div>
  );
}

export default TaskItem;