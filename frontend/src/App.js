import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Community from './pages/Community';
import Collaboration from './pages/Collaboration';
import Podcasts from './pages/Podcasts';
import Calendar from './pages/Calendar';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/community" component={Community} />
        <Route path="/collaboration" component={Collaboration} />
        <Route path="/podcasts" component={Podcasts} />
        <Route path="/calendar" component={Calendar} />
      </Switch>
    </Router>
  );
}

export default App;
