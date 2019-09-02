import React from 'react';
import { Field, reduxForm } from 'redux-form';

let ActionBar = () => {
  const createProvider = () => {};

  return (
    <div className="text-right">
      <button
        className="btn btn-lg btn-primary"
        style={{ marginRight: '10px' }}
      >
        Create
      </button>
      <button className="btn btn-lg btn-danger">Remove</button>
    </div>
  );
};

ActionBar = reduxForm({
  // a unique name for the form
  form: 'create-provider'
})(ActionBar);

export default ActionBar;
