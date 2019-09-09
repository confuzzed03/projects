import React from 'react';
import ProviderList from './ProviderList';
import '../css/App.css';

class App extends React.Component {
  render() {
    return (
      <div className="container" style={{ height: '100vh' }}>
        <div className="jumbotron">
          <h1 className="display-4">Provider Directory</h1>
          <p className="lead">
            The table below provides a directory for providers. Each provider
            has a first and last name, email, specialty, and practice. You may
            add and delete providers. Click on a field header to sort by field
            in ascending or descending order or search by any field name in the
            search bar. You may also select multiple providers via the checkbox
            to delete. There is also a select/deselect all for quicker
            selection.
          </p>
        </div>
        <ProviderList />
      </div>
    );
  }
}

export default App;
