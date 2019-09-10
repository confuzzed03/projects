import React from 'react';
import { Button } from 'react-bootstrap';
import CreateProvider from './CreateProvider';
import AlertComponent from './Alert';
import providerSvc from '../api/providerSvc';
import camelCase from '../utility/camelCase';

class ProviderList extends React.Component {
  constructor(props) {
    super(props);

    // hide alert, initialize list of ID's to remove, select all value, and search term
    this.state = {
      fields: [],
      providers: [],
      filteredProviders: [],
      removalList: [],
      searchTerm: '',
      sortedFieldIndex: -1,
      checkAll: false,
      alert: { show: false }
    };
    // retrieve providers from service
    this.getProviders();
  }

  getProviders = () => {
    providerSvc
      .get('/')
      .then(response => {
        let fields = [],
          filteredProviders = [];

        // if no providers, show alert
        if (!response.data.length) {
          this.showAlert({
            message: 'No providers to show',
            variant: 'warning'
          });
        } else {
          // Extract fields from data as headers except for default mongoDB fields if fields haven't been created
          if (!this.state.fields.length) {
            fields = Object.keys(response.data[0])
              .filter(field => {
                return field !== '_id' && field !== '__v';
              })
              .map(field => {
                // remove underlines and camel case fields
                return {
                  fieldName: field,
                  headerName: camelCase(field),
                  className: 'fa-sort',
                  toggle: false
                };
              });
          } else {
            // use existing fields
            fields = [...this.state.fields];
          }

          // filter by search term on providers
          filteredProviders = this.filterProvidersBySearch(response.data);
        }

        // providers holds original copy of providers
        // filteredProviders is the manipulated version of providers via sorts and searches
        this.setState(
          {
            fields,
            filteredProviders,
            providers: response.data
          },
          () => {
            // after filtering providers, sort by current selected field
            const filteredProviders = this.sortByField(
              this.state.sortedFieldIndex
            );
            this.setState({ filteredProviders });
          }
        );
      })
      .catch(error => {
        alert(error);
      });
  };

  removeIndividual = deletedId => {
    const address = '/' + deletedId + '/delete';
    // call delete service to remove provider
    providerSvc
      .delete(address)
      .then(() => {
        this.getProviders();
      })
      .catch(() => {
        // service failed, show alert
        this.showAlert({
          message: 'Failed to remove provider!',
          variant: 'danger'
        });
      });
  };

  handleCreateProvider = () => {
    // retrieve providers and show success alert
    this.getProviders();
    this.showAlert({
      message: 'New provider has successfully been created!',
      variant: 'success'
    });
  };

  handleCheckbox = (index, event) => {
    let filteredProviders = [...this.state.filteredProviders];
    if (index >= 0) {
      // update provider's checkbox selection
      filteredProviders[index].checked = event.target.checked;
      const removalList = [...this.state.removalList],
        removalIndex = removalList.indexOf(filteredProviders[index]._id);
      // removalList holds ID's of providers to remove
      if (removalIndex !== -1) {
        // provider is found in list, remove from list
        removalList.splice(removalIndex, 1);
      } else {
        // provider is added to list for removal
        removalList.push(filteredProviders[index]._id);
      }
      this.setState({ filteredProviders, removalList });
    }
  };

  handleSelectAll = event => {
    let removalList = [];
    // if select-all is checked, keep current removalList
    // otherwise, removalList should be empty
    if (event.target.checked) removalList = [...this.state.removalList];
    let filteredProviders = this.state.filteredProviders.map(provider => {
      // iterate through providers and select/unselect checkbox based on selectAll selection
      provider.checked = event.target.checked;
      const removalIndex = removalList.indexOf(provider._id);
      // if select-all checkbox is selected and provider is not in removal list,
      // add to removal list. Otherwise, no work needed as provider is already in list
      if (event.target.checked && removalIndex === -1) {
        removalList.push(provider._id);
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
    // alert user if there are no providers to remove
    if (!this.state.removalList.length) {
      this.showAlert({
        message: 'No providers selected to remove!',
        variant: 'warning'
      });
    } else {
      providerSvc
        .post('/multiDelete', this.state.removalList)
        .then(() => {
          // retrieve providers and filter by current search and sort field
          this.getProviders();
          // deselect select all box
          this.setState({ checkAll: false }, () => {
            // after filtering providers, sort by current selected field
            const filteredProviders = this.sortByField(
              this.state.sortedFieldIndex
            );
            this.setState({ filteredProviders });
          });
        })
        .catch(() => {
          // service failed, show alert
          this.showAlert({
            message: 'Failed to remove providers!',
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
    // automatically show alert
    alert.show = true;
    // automatic dismissal on alert, 3 seconds
    this.setState({ alert }, () => {
      window.setTimeout(() => {
        this.setState({ alert: defaultAlert });
      }, 2500);
    });
  };

  sortBySearch = searchTerm => {
    // Sort providers by selected field
    const filteredProviders = this.filterProvidersBySearch(
        this.state.providers,
        searchTerm
      ),
      // reset field headers on search
      fields = this.state.fields.map(field => {
        field.toggle = false;
        field.className = 'fa-sort';
        return field;
      });
    // reset select all checkbox and multi-removal list
    this.setState({
      fields,
      filteredProviders,
      removalList: [],
      checkAll: false,
      searchTerm
    });
  };

  sortByField = fieldIndex => {
    // if invalid index passed, return current filtered providers
    if (fieldIndex < 0) return [...this.state.filteredProviders];
    let field = { ...this.state.fields[fieldIndex] };

    // Sort providers by selected field
    let filteredProviders = [...this.state.filteredProviders].sort((a, b) => {
      let result = 0;

      // ascending, descending result respectively
      if (a[field.fieldName] > b[field.fieldName]) result = 1;
      else if (a[field.fieldName] < b[field.fieldName]) result = -1;

      // toggle indicates switch order
      if (!field.toggle) result *= -1;

      //return field.toggle && a[field.fieldName] > b[field.fieldName] ? 1 : -1;
      return result;
    });

    return filteredProviders;
  };

  // table header on-click handler for sorting by field
  handleSortByField = fieldIndex => {
    // if invalid index passed, return current filtered providers
    if (fieldIndex < 0) return [...this.state.filteredProviders];

    // gather all fields, selected field, and current sorted field index
    let fields = [...this.state.fields];
    const selectedField = { ...fields[fieldIndex] },
      sortedFieldIndex = this.state.sortedFieldIndex;

    // if current sorted field index is not the selected field to sort, reset current sorted field
    if (sortedFieldIndex >= 0 && fieldIndex !== sortedFieldIndex) {
      fields[sortedFieldIndex] = {
        ...fields[sortedFieldIndex],
        className: 'fa-sort',
        toggle: null
      };
    }

    // determine sort icon for selected field header based on ascending/descending toggle
    const className = selectedField.toggle ? 'fa-sort-up' : 'fa-sort-down',
      toggle = !selectedField.toggle;

    // prepare selected field for sort
    fields[fieldIndex] = {
      ...selectedField,
      className,
      toggle
    };

    this.setState({ fields, sortedFieldIndex: fieldIndex }, () => {
      // after filtering providers, sort by current selected field
      const filteredProviders = this.sortByField(fieldIndex);
      this.setState({ filteredProviders });
    });
  };

  filterProvidersBySearch = (
    providers = [],
    searchTerm = this.state.searchTerm
  ) => {
    // if no search term or providers, return given list
    if (!searchTerm.length || !providers.length) return [...providers];
    // return providers that fulfill search term across all fields
    return providers.filter(provider => {
      let result = false;
      // check across all fields for search term
      for (var field of this.state.fields) {
        if (provider[field.fieldName].toLowerCase().includes(searchTerm)) {
          result = true;
          break;
        }
      }
      return result;
    });
  };

  render() {
    // return an empty table if no fields were extracted from provider data
    let tableHeaders, tableBody;
    if (this.state.fields) {
      // set up table headers with onClick for sorting by field
      tableHeaders = this.state.fields.map((field, index) => {
        return (
          <th
            scope="col"
            key={field.fieldName}
            onClick={() => this.handleSortByField(index)}
            className="fieldHeaders"
          >
            {field.headerName}
            <i className={'fas ' + field.className}></i>
          </th>
        );
      });

      // create table data for each provider
      tableBody = this.state.filteredProviders.map((provider, index) => {
        return this.renderProvider(provider, index);
      });
    }

    return (
      <>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="search">Search</label>
              <input
                type="text"
                className="form-control"
                id="search"
                value={this.state.searchTerm}
                onChange={e => {
                  this.sortBySearch(e.target.value.toLowerCase());
                }}
              />
            </div>
          </div>
        </div>
        {/* alert component below search bar */}
        <AlertComponent alert={this.state.alert}></AlertComponent>
        <div id="providerList" className="row">
          <div className="col">
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center">
                    <div className="checkbox text-center">
                      {/* select/deselect all checkbox */}
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
            {/* create checkbox setting up for multi-removal selection on each provider */}
            <input
              type="checkbox"
              checked={this.state.removalList.indexOf(provider._id) !== -1}
              onChange={event => this.handleCheckbox(index, event)}
            />
          </div>
        </td>

        {/* Populate provider data across extractedd fields */}
        {this.state.fields.map(({ headerName, fieldName }) => {
          return (
            <td key={provider._id + '-' + headerName}>{provider[fieldName]}</td>
          );
        })}

        <td>
          <div className="text-center">
            {/* create 'X' button for immediate individual removal */}
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => this.removeIndividual(provider._id)}
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
