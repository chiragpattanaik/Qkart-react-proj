import Login from "./components/Login";
import Register from "./components/Register";
import Products  from "./components/Products ";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router";

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
    <Route path="/register">
      <Register />
    </Route>
    <Route path="/Products">
      <Products  />
    </Route>
  </Switch>
    </div>
  );
}

export default App;
