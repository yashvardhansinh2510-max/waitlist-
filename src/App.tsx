import { Router, Route, Switch } from "wouter";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import "./index.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/auth" component={Auth} />
        <Route path="/dashboard" component={Dashboard} />
        {/* Default 404 handler */}
        <Route>
          <div className="bb-page">
            <main className="bb-main">
              <h1 className="bb-heading">404</h1>
              <p className="bb-subheading">Page not found.</p>
              <a href="/" className="bb-button">Go Home</a>
            </main>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
