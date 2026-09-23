import React from "react";

function TaskForm({
  newTodo,
  handleInputChange,
  handleSubmit,
}) {
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={newTodo}
        onChange={handleInputChange}
        placeholder="Enter a new task"
      />

      <button type="submit">
        Add
      </button>
    </form>
  );
}

export default TaskForm;