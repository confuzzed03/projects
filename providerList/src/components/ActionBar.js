// import React, { useState } from 'react';
// import { Modal, Form } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
// import '../css/CreateProvider.css';

// const ProviderModal = props => {
//   const [validated, setValidated] = useState(false);

//   const [firstValid, setfirstValid] = useState(false);

//   const handleSubmit = event => {
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.preventDefault();
//       event.stopPropagation();
//     }
//     debugger;

//     setValidated(true);
//   };

//   const handleClose = () => {
//     setValidated(false);
//     props.onHide();
//   };

//   const handleBlur = event => {
//     setfirstValid(true);
//   };

//   return (
//     <Modal
//       {...props}
//       id="createProviderModal"
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//       onExit={handleClose}
//     >
//       <Modal.Header closeButton>
//         <Modal.Title>New Provider Information</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form
//           id="createProviderForm"
//           noValidate
//           validated={validated}
//           onSubmit={handleSubmit}
//         >
//           <Form.Row>
//             <Form.Group className="col-6" controlId="firstName">
//               <Form.Label>First name</Form.Label>
//               <Form.Control
//                 required
//                 type="text"
//                 placeholder="First name"
//                 onBlur={handleBlur}
//                 isInvalid={firstValid}
//               />
//               <Form.Control.Feedback type="invalid">
//                 First name is required!
//               </Form.Control.Feedback>
//             </Form.Group>
//             <Form.Group className="col-6" controlId="lastName">
//               <Form.Label>Last name</Form.Label>
//               <Form.Control required type="text" placeholder="Last name" />
//               <Form.Control.Feedback type="invalid">
//                 Last name is required!
//               </Form.Control.Feedback>
//             </Form.Group>
//           </Form.Row>
//           <Form.Row>
//             <Form.Group className="col-12" controlId="email">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control required type="email" placeholder="Enter email" />
//               <Form.Text className="text-muted">
//                 We'll never share your email with anyone else.
//               </Form.Text>
//               <Form.Control.Feedback type="invalid">
//                 Email address is required!
//               </Form.Control.Feedback>
//             </Form.Group>
//           </Form.Row>
//           <Form.Row>
//             <Form.Group className="col-6" controlId="specialty">
//               <Form.Label>
//                 Specialty <i> - Optional</i>
//               </Form.Label>
//               <Form.Control type="text" placeholder="Specialty" />
//             </Form.Group>
//             <Form.Group className="col-6" controlId="practiceName">
//               <Form.Label>
//                 Provider <i> - Optional</i>
//               </Form.Label>
//               <Form.Control type="text" placeholder="Provider" />
//             </Form.Group>
//           </Form.Row>
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="primary" type="submit" form="createProviderForm">
//           Submit
//         </Button>
//         <Button variant="danger" onClick={handleClose}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// const CreateProvider = () => {
//   const [modalShow, setModalShow] = useState(true);

//   return (
//     <>
//       <Button
//         id="createProviderBtn"
//         variant="primary"
//         onClick={() => setModalShow(true)}
//       >
//         Create
//       </Button>
//       <ProviderModal show={modalShow} onHide={() => setModalShow(false)} />
//     </>
//   );
// };

// export default CreateProvider;
