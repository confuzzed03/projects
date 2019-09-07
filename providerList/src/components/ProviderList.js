import React from 'react';
import CreateProvider from './CreateProvider';
import RemoveProvider from './RemoveProvider';
import camelCase from '../utility/camelCase';
import providers from '../db/providers.json';
import AlertComponent from './Alert';

class ProviderList extends React.Component {
  constructor(props) {
    super(props);
    let fields = [];
    // Extract fields from data as headers, remove underlines and camel case
    if (providers.length) {
      fields = Object.keys(providers[0]).map(field => {
        return {
          fieldName: field,
          headerName: camelCase(field),
          className: 'fa-sort',
          toggle: false
        };
      });
    }

    this.state = {
      filteredProviders: providers,
      fields: fields
    };
  }

  removeIndividual = deletedProvider => {
    this.setState({
      filteredProviders: this.state.filteredProviders.filter(provider => {
        return provider !== deletedProvider;
      })
    });
  };

  handleCreateProvider = (newProvider, alert) => {
    const defaultAlert = {
      showAlert: false,
      alertMessage: '',
      alertVariant: ''
    };
    this.setState(
      {
        showAlert: alert.show,
        alertMessage: alert.message,
        alertVariant: alert.variant,
        filteredProviders: [newProvider, ...this.state.filteredProviders]
      },
      () => {
        window.setTimeout(() => {
          this.setState(defaultAlert);
        }, 2000);
      }
    );
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
    if (!this.state.fields) return <table></table>;

    return (
      <>
        <AlertComponent
          show={this.state.showAlert}
          message={this.state.alertMessage}
          variant={this.state.alertVariant}
        ></AlertComponent>
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
                  {this.state.fields.map((field, index) => {
                    return (
                      <th
                        scope="col"
                        key={field.fieldName}
                        onClick={() => this.sortByField(index)}
                      >
                        {field.headerName}
                        <i className={`fas ${field.className}`}></i>
                      </th>
                    );
                  })}

                  <th style={{ paddingRight: '13px' }}>
                    <div className="text-center">
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
                {this.state.filteredProviders.map(provider => {
                  return this.renderProvider(provider);
                })}
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
      <tr key={provider.email_address}>
        <td>
          <div className="checkbox text-center">
            <input type="checkbox" />
          </div>
        </td>

        {/* Populate provider data */}
        {this.state.fields.map(({ headerName, fieldName }) => {
          return (
            <td key={provider.email_address + headerName}>
              {fieldName !== 'email_address'
                ? camelCase(provider[fieldName])
                : provider[fieldName]}
            </td>
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
