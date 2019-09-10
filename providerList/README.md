## Provider Directory

This application serves as a provider directory. Each provider has a first and last name, email, specialty, and practice.

You may add a provider by clicking on the create button below the table. A modal will be shown providing a form for user input. First name, last name, and email address are required. The name fields must not exceed 50 characters each. The email address must be in valid form. Specialty and practice name are optional, but limited to 50 characters.

It is assumed that every provider is unique to the provided email address, so use of the same email address is not allowed. When the form is submitted, the service will check if the email address is already used before saving. Please make sure to use a unique email address.

To remove a provider, either click on the 'X' button on the far right side of the provider or instead select the checkbox on the far-left side and click the remove button below the table to remove multiple providers all at once. There is a checkbox on the far-left table header that will select/deselect all providers currently in view. A new search will reset this selection.

Click on a field header to sort by the selected field. Clicking the same header will toggle between ascending and descending order. Only one field at a time can be sorted.

A search bar is also provided above the table, and the search is performed as you type. The search term will be matched across all fields of the providers, and if matches are found, the table will be updated with the results.

### Instructions

The provider directory runs on a client and backend application.

To run this application, both this client and the backend service need to be cloned.

Once both are retrieved, run `node install;node app.js` on backend, then run `node install;npm start` on client.

The port number on the client and backend service should be `3000` and `9000` respectively which is the default. Ensure the backend runs on port `9000`.

Please see instructions on backend README as well. Backend repo is located here: https://github.com/confuzzed03/ProviderService
