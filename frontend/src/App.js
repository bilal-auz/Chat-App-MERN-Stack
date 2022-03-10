import { Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPages";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Route path="/" exact component={HomePage} />
      <Route path="/chats" component={ChatPage} />
    </div>
  );
}

export default App;
