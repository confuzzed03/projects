import React from 'react';
import { Alert } from 'react-bootstrap';

class AlertComponent extends React.Component {
  render() {
    // extract fields from props data
    const { show, variant, message } = this.props.alert;
    // Check if alert is shown
    if (!show) return null;
    return (
      <Alert key="provider-alert" variant={variant}>
        {message}
      </Alert>
    );
  }
}

export default AlertComponent;
