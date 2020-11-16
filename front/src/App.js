import { useEffect } from "react";
import "./App.css";
import MainPage from "./MainPage";
import Registration from "./Registration";
import SingIn from "./SignIn";

function App() {
  return (
    <div className="App">
      <Registration />
      <SingIn />
      <MainPage />
    </div>
  );
}

export default App;
