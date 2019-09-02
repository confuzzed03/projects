import React from 'react';
import providers from '../db/providers.json';

class ProviderList extends React.Component {
  constructor(props) {
    super(props);

    let fields = [];

    // Extract fields from data as headers, remove underlines and camel case
    if (providers.length) {
      fields = Object.keys(providers[0]).map(field => {
        return {
          fieldName: field,
          headerName: this.convertToCamelCase(field),
          className: 'fa-sort',
          toggle: false
        };
      });
    }

    this.state = {
      filteredProviders: providers,
      fields
    };
  }

  removeIndividual = deletedProvider => {
    this.setState({
      filteredProviders: this.state.filteredProviders.filter(provider => {
        return provider !== deletedProvider;
      })
    });
  };

  // converts data field name to camel case form
  convertToCamelCase = field => {
    return field.replace('_', ' ').replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // table header on-click handler for sorting by field
  sortByField = fieldIndex => {
    let field = this.state.fields[fieldIndex];

    // Sort providers by selected field
    let newFilteredProviders = this.state.filteredProviders
      .slice()
      .sort((a, b) => {
        let result = 0;

        if (a[field.fieldName] > b[field.fieldName]) {
          // ascending result
          result = 1;
        } else if (a[field.fieldName] < b[field.fieldName]) {
          // descending result
          result = -1;
        }

        // toggle indicates switch order
        if (field.toggle) {
          result *= -1;
        }

        //return field.toggle && a[field.fieldName] > b[field.fieldName] ? 1 : -1;
        return result;
      });

    // create new fields array
    let fields = this.state.fields.map((field, index) => {
      let toggle = null,
        className = 'fa-sort';

      if (index === fieldIndex) {
        // Change sorting icon based on ascending/descending
        className = field.toggle === true ? 'fa-sort-up' : 'fa-sort-down';
        toggle = !field.toggle;
      }
      // reset last sorted field
      return Object.assign({}, field, { className, toggle });
    });

    this.setState({
      fields: fields,
      filteredProviders: newFilteredProviders
    });
  };

  render() {
    // return an empty table if no provider data is given
    if (!this.state.fields) return <table></table>;

    return (
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

            <th />
          </tr>
        </thead>
        <tbody>
          {/* Populate table rows for providers */}
          {this.state.filteredProviders.map(provider => {
            return this.renderProvider(provider);
          })}
        </tbody>
      </table>
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
        {this.state.fields.map(field => {
          return (
            <td key={provider.email_address + field.headerName}>
              {field.fieldName !== 'email_address'
                ? this.convertToCamelCase(provider[field.fieldName])
                : provider[field.fieldName]}
            </td>
          );
        })}

        <td>
          <div className="text-center">
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => {
                this.removeIndividual(provider);
              }}
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
