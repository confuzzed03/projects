import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import validator from 'validator';
import providerSvc from '../api/providerSvc';
import camelCase from '../utility/camelCase';
import '../css/CreateProvider.css';

class CreateProvider extends React.Component {
  // reset form when needed
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

  // when modal is closed, reset form
  handleClose = () => {
    this.setState({ ...this.formDefaults });
  };

  // remove any leading/trailing whitespace when entering input is finished
  onBlur = e => {
    const key = e.target.name;
    this.setState({
      [key]: {
        ...this.state[key],
        value: e.target.value.trim()
      }
    });
  };

  onSubmit = e => {
    e.preventDefault();
    // remove any previouslydone validation before running new validation
    this.resetValidation();
    // run the validation, and move on
    if (this.isFormValid()) {
      // create provider payload
      let newProvider = {
        last_name: camelCase(this.state.lastName.value),
        first_name: camelCase(this.state.firstName.value),
        email_address: this.state.email.value,
        specialty: camelCase(this.state.specialty.value),
        practice_name: camelCase(this.state.practice.value)
      };
      providerSvc
        .post('/create', newProvider)
        .then(response => {
          // return any errors from response e.g. email already taken
          if (response.data.error) {
            let email = { ...this.state.email };
            email.isValid = false;
            email.message = response.data.error;
            this.setState({ email });
          } else {
            // reset validation on modal and close
            this.setState({
              modalShow: false,
              validated: false
            });
            // pass new provider to callback on submit
            this.props.formSubmitCallback();
          }
        })
        .catch(error => {
          alert(error);
        });
    }
  };

  resetValidation = () => {
    const state = { ...this.state };
    Object.keys(state).forEach(key => {
      // iterate through state and reset any validation
      if (state[key].hasOwnProperty('isValid')) {
        state[key].isValid = true;
        state[key].message = '';
      }
    });
    this.setState(state);
  };

  checkInput = input => {
    let result = { ...input };
    // required field
    if (!input.value.length) {
      result.isValid = false;
      result.message = 'Please fill out this field!';
      return result;
    }
    // check field is only using letters
    if (!validator.isAlpha(input.value)) {
      result.isValid = false;
      result.message = 'Please use only letters!';
      return result;
    }
    // check max length
    if (!validator.isLength(input.value, { max: 50 })) {
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

    // run validation on name
    firstName = this.checkInput(firstName);
    lastName = this.checkInput(lastName);

    // email validation
    if (!validator.isEmail(email.value)) {
      email.isValid = false;
      email.message = 'Not a valid email address';
    }
    // specialty and practice name length validation
    if (!validator.isLength(specialty.value, { min: 0, max: 50 })) {
      specialty.isValid = false;
      specialty.message = 'Please keep within 1-50 characters!';
    }
    if (!validator.isLength(practice.value, { min: 0, max: 50 })) {
      practice.isValid = false;
      practice.message = 'Please keep within 1-50 characters!';
    }
    // if form is not valid, set validation on form
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
    // form is valid
    return true;
  };

  // show or hide modal
  handleModalShow = value => {
    this.setState({ modalShow: value });
  };

  // set value of field on state
  handleOnChange = event => {
    const value = {
      ...this.state[event.target.name],
      value: event.target.value
    };
    this.setState({
      [event.target.name]: value
    });
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
                    name="firstName"
                    placeholder="First name"
                    value={this.state.firstName.value}
                    onChange={this.handleOnChange}
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
                    required
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={this.state.lastName.value}
                    onChange={this.handleOnChange}
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
                    type="text"
                    name="email"
                    placeholder="Enter email"
                    value={email.value}
                    onChange={this.handleOnChange}
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
                    value={this.state.specialty.value}
                    onChange={this.handleOnChange}
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
                    value={this.state.practice.value}
                    onChange={this.handleOnChange}
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
