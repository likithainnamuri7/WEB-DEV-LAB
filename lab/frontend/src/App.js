import React, { Component } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      newTodo: "",
    };
  }

  // Fetch tasks when the application loads
  componentDidMount() {
    this.fetchTodos();
  }

  // Get all tasks from the backend
  fetchTodos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/todos"
      );

      this.setState({
        todos: response.data,
      });
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Handle input field changes
  handleInputChange = (event) => {
    this.setState({
      newTodo: event.target.value,
    });
  };

  // Add a new task
  handleSubmit = async (event) => {
    event.preventDefault();

    const { newTodo, todos } = this.state;

    if (newTodo.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/todos",
        {
          task: newTodo,
          completed: false,
        }
      );

      this.setState({
        todos: [...todos, response.data],
        newTodo: "",
      });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Complete / undo a task
  toggleTodo = async (todo) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/todos/${todo._id}`,
        {
          completed: !todo.completed,
        }
      );

      const updatedTodos = this.state.todos.map((item) =>
        item._id === todo._id ? response.data : item
      );

      this.setState({
        todos: updatedTodos,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete a task
  deleteTodo = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/todos/${id}`
      );

      this.setState({
        todos: this.state.todos.filter(
          (todo) => todo._id !== id
        ),
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  render() {
    return (
      <div className="app">
        <div className="todo-container">

          <div className="app-header">
            <h2>TO DO APPLICATION</h2>
            <p>finishing works is a habit</p>
          </div>

          <TaskForm
            newTodo={this.state.newTodo}
            handleInputChange={this.handleInputChange}
            handleSubmit={this.handleSubmit}
          />

          <TaskList
            todos={this.state.todos}
            toggleTodo={this.toggleTodo}
            deleteTodo={this.deleteTodo}
          />

        </div>
      </div>
    );
  }
}

export default App;