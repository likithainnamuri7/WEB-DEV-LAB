import React from "react";
import TaskItem from "./TaskItem";

function TaskList({
  todos,
  toggleTodo,
  deleteTodo,
}) {
  if (todos.length === 0) {
    return <p>No tasks available.</p>;
  }

  return (
    <div className="task-list">
      {todos.map((todo) => (
        <TaskItem
          key={todo._id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      ))}
    </div>
  );
}

export default TaskList;
