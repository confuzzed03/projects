import React from 'react';
import { Button } from 'react-bootstrap';
import SearchBar from './SearchBar';
import CreateProvider from './CreateProvider';
import AlertComponent from './Alert';
import providerSvc from '../api/providerSvc';
import camelCase from '../utility/camelCase';

class ProviderList extends React.Component {
  constructor(props) {
    super(props);
    this.getProviders();
    this.state = { alert: { show: false }, removalList: [], checkAll: false };
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
          message: 'Failed to remove provider!',
          variant: 'danger'
        });
      });
  };

  handleCreateProvider = alert => {
    this.getProviders();
    this.showAlert(alert);
  };

  handleCheckbox = (index, event) => {
    let filteredProviders = [...this.state.filteredProviders];
    if (index >= 0) {
      filteredProviders[index] = {
        ...filteredProviders[index],
        checked: event.target.checked
      };
      const removalList = [...this.state.removalList],
        removalIndex = removalList.indexOf(filteredProviders[index]._id);
      if (removalIndex !== -1) {
        removalList.splice(removalIndex, 1);
      } else {
        removalList.push(filteredProviders[index]._id);
      }
      this.setState({ filteredProviders, removalList });
    }
  };

  handleSelectAll = event => {
    let removalList = [];
    if (event.target.checked) removalList = [...this.state.removalList];
    let filteredProviders = this.state.filteredProviders.map(provider => {
      provider.checked = event.target.checked;
      const removalIndex = removalList.indexOf(provider._id);
      if (event.target.checked) {
        if (removalIndex === -1) {
          removalList.push(provider._id);
        }
      }
      return provider;
    });
    this.setState({
      filteredProviders,
      removalList,
      checkAll: event.target.checked
    });
  };

  handleMultiRemove = () => {
    if (!this.state.removalList.length) {
      this.showAlert({
        message: 'No providers selected to remove!',
        variant: 'warning'
      });
    } else {
      debugger;
      providerSvc
        .post('/multiDelete', this.state.removalList)
        .then(() => {
          const providers = this.state.providers.filter(provider => {
            return this.state.removalList.indexOf(provider._id) === -1;
          });
          this.setState({
            providers,
            filteredProviders: providers,
            checkAll: false
          });
        })
        .catch(() => {
          this.showAlert({
            message: 'Failed to remove provider!',
            variant: 'danger'
          });
        });
    }
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
      filteredProviders,
      removalList: [],
      checkAll: false,
      searchTerm
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

      tableBody = this.state.filteredProviders.map((provider, index) => {
        return this.renderProvider(provider, index);
      });
    }

    return (
      <>
        <div className="row">
          <div className="col">
            <SearchBar
              searchTerm={this.state.searchTerm}
              searchCallback={this.sortBySearch}
            />
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
                      <input
                        type="checkbox"
                        onChange={this.handleSelectAll}
                        checked={this.state.checkAll}
                      />
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
              <Button variant="danger" onClick={this.handleMultiRemove}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  renderProvider = (provider, index) => {
    return (
      <tr key={provider._id}>
        <td>
          <div className="checkbox text-center">
            <input
              type="checkbox"
              checked={
                this.state.removalList.indexOf(provider._id) !== -1
                  ? true
                  : false
              }
              onChange={event => this.handleCheckbox(index, event)}
            />
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
