import React from 'react';
import ProviderList from './ProviderList';
import '../css/App.css';

class App extends React.Component {
  render() {
    return (
      <div className="container" style={{ height: '100vh' }}>
        <div className="jumbotron">
          <h1 className="display-4">Provider List</h1>
          <p className="lead">
            The table below provides a list of providers. Each provider has a
            first and last name, email, specialty, and practice. You may add,
            edit, and delete providers. The table is also able to sort by each
            field.
          </p>
        </div>
        <ProviderList />
      </div>
    );
  }
}

export default App;
