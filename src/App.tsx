// App.tsx
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LoginScreen, RegisterScreen, ChatScreen, SettingsScreen } from './screens';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginScreen} />
        <Route path="/register" component={RegisterScreen} />
        <Route path="/chat" component={ChatScreen} />
        <Route path="/settings" component={SettingsScreen} />
        <Route path="/" exact component={LoginScreen} />
      </Switch>
    </Router>
  );
};

export default App;