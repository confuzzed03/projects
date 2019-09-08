import React from 'react';
import { Alert } from 'react-bootstrap';

class AlertComponent extends React.Component {
  render() {
    const { show, variant, message } = this.props.alert;
    if (!show) return null;
    debugger;

    return (
      <Alert key="provider-alert" variant={variant}>
        {message}
      </Alert>
    );
  }
}

export default AlertComponent;
