import Login from "./components/Login";
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import Products from "./components/Products";
import { Route, Switch } from "react-router-dom";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
         {/* <Register /> */}
<Switch>
    <Route exact path="/login">
      <Login />
    </Route>
    <Route exact path="/register">
      <Register />
    </Route>
    <Route exact path="/">
      <Products />
    </Route>
</Switch>
    </div>
  );
}

export default App;
