import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import validator from 'validator';
import providerSvc from '../api/providerSvc';
import camelCase from '../utility/camelCase';
import '../css/CreateProvider.css';

class CreateProvider extends React.Component {
  formDefaults = {
    modalShow: false,
    validated: false,
    firstName: { value: '', isValid: true, message: '' },
    lastName: { value: '', isValid: true, message: '' },
    email: { value: '', isValid: true, message: '' },
    specialty: { value: '', isValid: true, message: '' },
    practice: { value: '', isValid: true, message: '' }
  };

  state = {
    ...this.formDefaults
  };

  handleClose = () => {
    this.setState({ ...this.formDefaults });
  };

  onBlur = e => {
    const key = e.target.name;
    this.setState({
      ...this.state,
      [key]: {
        ...this.state[key],
        value: e.target.value.trim()
      }
    });
  };

  onChange = e => {
    const key = e.target.name;
    this.setState({
      ...this.state,
      [key]: {
        ...this.state[key],
        value: e.target.value
      }
    });
  };

  onSubmit = e => {
    e.preventDefault();
    // reset states before the validation procedure is run.
    this.resetValidation();
    // run the validation, and if it's good move on.
    if (this.isFormValid()) {
      let newProvider = {
        last_name: camelCase(this.state.lastName.value),
        first_name: camelCase(this.state.firstName.value),
        email_address: this.state.email.value,
        specialty: camelCase(this.state.specialty.value),
        practice_name: camelCase(this.state.practice.value)
      };
      providerSvc
        .post('/providers/create', newProvider)
        .then(() => {
          this.setState({ ...this.state, modalShow: false, validated: false });
          this.props.formSubmitCallback(newProvider, {
            show: true,
            message: 'New provider has successfully been created!',
            variant: 'success'
          });
        })
        .catch(error => {
          alert(error);
        });
    }
  };

  resetValidation = () => {
    const state = { ...this.state };
    Object.keys(state).forEach(key => {
      if (state[key].hasOwnProperty('isValid')) {
        state[key].isValid = true;
        state[key].message = '';
      }
    });
    this.setState(state);
  };

  checkInput = (input, isAlpha = true) => {
    if (!input) return '';

    let result = { ...input, value: input.value };
    if (!isAlpha) {
      if (!validator.isAlphanumeric(input.value)) {
        result.isValid = false;
        result.message = 'Please use only letters and numbers!';
        return result;
      }
    } else if (!validator.isAlpha(input.value)) {
      result.isValid = false;
      result.message = 'Please use only letters!';
      return result;
    }

    if (!validator.isLength(input.value, { min: 1, max: 50 })) {
      result.isValid = false;
      result.message = 'Please keep within 1-50 characters!';
      return result;
    }

    return result;
  };

  isFormValid = () => {
    let firstName = { ...this.state.firstName },
      lastName = { ...this.state.lastName },
      email = { ...this.state.email },
      specialty = { ...this.state.specialty },
      practice = { ...this.state.practice };

    firstName = this.checkInput(firstName);
    lastName = this.checkInput(lastName);

    if (!validator.isEmail(email.value)) {
      email.isValid = false;
      email.message = 'Not a valid email address';
    }
    if (!validator.isLength(specialty.value, { min: 0, max: 50 })) {
      specialty.isValid = false;
      specialty.message = 'Please keep within 1-50 characters!';
    }
    if (!validator.isLength(practice.value, { min: 0, max: 50 })) {
      practice.isValid = false;
      practice.message = 'Please keep within 1-50 characters!';
    }
    if (
      !firstName.isValid ||
      !lastName.isValid ||
      !email.isValid ||
      !specialty.isValid ||
      !practice.isValid
    ) {
      this.setState({
        ...this.state,
        ...{ firstName, lastName, email, specialty, practice }
      });
      return false;
    }
    return true;
  };

  handleModalShow = value => {
    this.setState({ modalShow: value });
  };

  render() {
    const {
      modalShow,
      validated,
      firstName,
      lastName,
      email,
      specialty,
      practice
    } = this.state;

    return (
      <>
        <Button
          id="createProviderBtn"
          variant="primary"
          onClick={() => this.handleModalShow(true)}
        >
          Create
        </Button>
        <Modal
          show={modalShow}
          onHide={() => this.handleModalShow(false)}
          id="createProviderModal"
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onExit={this.handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>New Provider Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              id="createProviderForm"
              noValidate
              validated={validated}
              onSubmit={this.onSubmit}
            >
              <Form.Row>
                <Form.Group className="col-6" controlId="firstName">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="First name"
                    name="firstName"
                    value={firstName.value}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    isInvalid={!firstName.isValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    {firstName.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-6" controlId="lastName">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    name="lastName"
                    required
                    type="text"
                    placeholder="Last name"
                    value={lastName.value}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    isInvalid={!lastName.isValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    {lastName.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group className="col-12" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    className={!email.isValid ? 'is-invalid' : ''}
                    value={email.value}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    isInvalid={!email.isValid}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {email.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group className="col-6" controlId="specialty">
                  <Form.Label>
                    Specialty <i> - Optional</i>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="specialty"
                    placeholder="Specialty"
                    value={specialty.value}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    isInvalid={!specialty.isValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    {specialty.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-6" controlId="practice">
                  <Form.Label>
                    Practice <i> - Optional</i>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="practice"
                    placeholder="Practice"
                    value={practice.value}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    isInvalid={!practice.isValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    {practice.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" form="createProviderForm">
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CreateProvider;
