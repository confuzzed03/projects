import React from 'react';
import SearchBar from './SearchBar';
import CreateProvider from './CreateProvider';
import RemoveProvider from './RemoveProvider';
import AlertComponent from './Alert';
import providerSvc from '../api/providerSvc';
import camelCase from '../utility/camelCase';

class ProviderList extends React.Component {
  constructor(props) {
    super(props);
    this.getProviders();
    this.state = { alert: { show: false } };
  }

  getProviders = () => {
    providerSvc
      .get('/')
      .then(response => {
        let fields = [];
        // Extract fields from data as headers, remove underlines and camel case
        if (response.data.length) {
          fields = Object.keys(response.data[0])
            .filter(field => {
              return field !== '_id' && field !== '__v' ? true : false;
            })
            .map(field => {
              return {
                fieldName: field,
                headerName: camelCase(field),
                className: 'fa-sort',
                toggle: false
              };
            });
        }

        this.setState({
          fields: fields,
          providers: response.data,
          filteredProviders: response.data
        });
      })
      .catch(error => {
        alert(error);
      });
  };

  removeIndividual = deletedProvider => {
    const address = '/' + deletedProvider._id + '/delete';
    providerSvc
      .delete(address)
      .then(() => {
        const providers = this.state.providers.filter(provider => {
          return provider !== deletedProvider;
        });
        this.setState({
          providers,
          filteredProviders: providers
        });
      })
      .catch(() => {
        this.showAlert({
          alertMessage: 'Failed to remove provider!',
          alertVariant: 'danger'
        });
      });
  };

  handleCreateProvider = alert => {
    this.getProviders();
    this.showAlert(alert);
  };

  showAlert = alert => {
    const defaultAlert = {
      show: false,
      message: '',
      variant: ''
    };
    alert.show = true;
    this.setState({ alert }, () => {
      window.setTimeout(() => {
        this.setState({ alert: defaultAlert });
      }, 3000);
    });
  };

  sortBySearch = searchTerm => {
    // Sort providers by selected field
    const filteredProviders = this.state.providers.slice().filter(provider => {
      let result = false;
      this.state.fields.forEach(field => {
        if (provider[field.fieldName].toLowerCase().includes(searchTerm)) {
          result = true;
          return;
        }
      });
      return result;
    });

    const fields = this.state.fields.map(field => {
      field.toggle = false;
      field.className = 'fa-sort';
      return field;
    });

    this.setState({
      fields,
      filteredProviders
    });
  };

  // table header on-click handler for sorting by field
  sortByField = fieldIndex => {
    let field = this.state.fields[fieldIndex];

    // Sort providers by selected field
    let filteredProviders = this.state.filteredProviders
      .slice()
      .sort((a, b) => {
        let result = 0;

        // ascending, descending result respectively
        if (a[field.fieldName] > b[field.fieldName]) result = 1;
        else if (a[field.fieldName] < b[field.fieldName]) result = -1;

        // toggle indicates switch order
        if (field.toggle) result *= -1;

        //return field.toggle && a[field.fieldName] > b[field.fieldName] ? 1 : -1;
        return result;
      });

    // create new fields array
    let fields = this.state.fields.map((field, index) => {
      let toggle = null,
        className = 'fa-sort';

      if (index === fieldIndex) {
        // Change sorting icon based on ascending/descending
        className = field.toggle ? 'fa-sort-up' : 'fa-sort-down';
        toggle = !field.toggle;
      }
      // reset last sorted field
      return Object.assign({}, field, { className, toggle });
    });

    this.setState({
      fields,
      filteredProviders
    });
  };

  render() {
    // return an empty table if no provider data is given
    let tableHeaders, tableBody;
    if (this.state.fields) {
      tableHeaders = this.state.fields.map((field, index) => {
        return (
          <th
            scope="col"
            key={field.fieldName}
            onClick={() => this.sortByField(index)}
          >
            {field.headerName}
            <i className={'fas ' + field.className}></i>
          </th>
        );
      });

      tableBody = this.state.filteredProviders.map(provider => {
        return this.renderProvider(provider);
      });
    }

    return (
      <>
        <div className="row">
          <div className="col">
            <SearchBar searchCallback={this.sortBySearch} />
          </div>
        </div>
        <AlertComponent alert={this.state.alert}></AlertComponent>
        <div id="providerList" className="row">
          <div className="col">
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center">
                    <div className="checkbox text-center">
                      <input type="checkbox" />
                    </div>
                  </th>

                  {/* Populate table headers */}
                  {tableHeaders}

                  <th style={{ paddingRight: '13px' }}>
                    <div className="text-center" style={{ cursor: 'default' }}>
                      <i
                        className="fas fa-trash-alt text-center"
                        style={{ float: 'right' }}
                      ></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Populate table rows for providers */}
                {tableBody}
              </tbody>
            </table>
          </div>
        </div>
        <div id="ActionBar" className="row">
          <div className="col">
            <div className="text-right">
              <CreateProvider formSubmitCallback={this.handleCreateProvider} />
              <RemoveProvider />
            </div>
          </div>
        </div>
      </>
    );
  }

  renderProvider = provider => {
    return (
      <tr key={provider._id}>
        <td>
          <div className="checkbox text-center">
            <input type="checkbox" />
          </div>
        </td>

        {/* Populate provider data */}
        {this.state.fields.map(({ headerName, fieldName }) => {
          return (
            <td key={provider._id + '-' + headerName}>{provider[fieldName]}</td>
          );
        })}

        <td>
          <div className="text-center">
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => this.removeIndividual(provider)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </td>
      </tr>
    );
  };
}

export default ProviderList;
