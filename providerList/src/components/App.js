import React from 'react';
import SearchBar from './SearchBar';
import ProviderList from './ProviderList';
// import CreateProvider from './CreateProvider';
// import RemoveProvider from './RemoveProvider';
import '../css/App.css';

class App extends React.Component {
  state = {
    newProvider: null
  };

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
        <div className="row">
          <div className="col">
            <SearchBar />
          </div>
        </div>
        <ProviderList />
      </div>
    );
  }
}

export default App;
