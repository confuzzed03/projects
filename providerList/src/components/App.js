import React from 'react';
import SearchBar from './SearchBar';
import ProviderList from './ProviderList';
import CreateProvider from './CreateProvider';
import RemoveProvider from './RemoveProvider';
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
        <div className="row">
          <div className="col">
            <SearchBar />
          </div>
        </div>
        <div id="providerList" className="row">
          <div className="col">
            <ProviderList />
          </div>
        </div>
        <div id="ActionBar" className="row">
          <div className="col">
            <div className="text-right">
              <CreateProvider />
              <RemoveProvider />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
