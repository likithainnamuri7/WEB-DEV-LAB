import { useState } from "react";
import "./app5.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h2>Counter App</h2>

      <div className="counter">{count}</div>

      <div className="button-section">
        <button
          className="increment"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>

        <button
          className="decrement"
          onClick={() => setCount(count - 1)}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}

export default App;
