import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import './profile.css';
import { MdEdit } from "react-icons/md";
import PasswordModal from '../components/PasswordModal';
import profilePic from '../assets/default-profile.jpg';

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
  });

  const handleEdit = () => {
    setIsEdit(prev => !prev);
  }

  return (
    <Container className="p-3 mt-5" style={{height: "93vh"}}>
      <h2>Profile</h2>
      <p className='text-secondary'>Manage your account information</p>
      <Card style={{ width: '100%' }}>
        <Card.Body>
          <div className="profile-image-input d-flex align-items-center mb-4">
            <img
              src={profilePic}
              className="border border-2 rounded-circle"
              alt="Profile Picture"
              style={{ height: "150px", width: "150px", objectFit: "cover" }}
            />
            <div className="ms-4 text-center">
              <label htmlFor="profile-picture" className="form-label fw-bold">
                Change Profile Picture
              </label>
              <input id="profile-picture" className="form-control form-control-sm" type="file" disabled={!isEdit}/>
            </div>
          </div>
          <Form>
            <Row >
              <Col md={12} lg={6}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label className='fw-bold'>Name</Form.Label>
                  <Form.Control 
                  name="name" 
                  type="text"
                  disabled = {!isEdit} 
                  autoComplete="off" 
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                  placeholder="Enter your name" 
                  required
                  />
                </Form.Group>
              </Col>
              <Col md={12} lg={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className='fw-bold'>Email address</Form.Label>
                  <Form.Control 
                  name="email" 
                  type="email" 
                  disabled = {!isEdit} 
                  autoComplete="off" 
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                  placeholder="Enter your email" 
                  required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button 
            variant="primary" 
            onClick={handleEdit}
            className='d-flex align-items-center'
            >
              {!isEdit ? <><MdEdit className='me-1'/> <span>Edit</span></> : "Save Changes"}
            </Button>
            <Form.Group className="mb-3 d-flex justify-content-between mt-3 p-3 border-bottom border-top" controlId="customSwitch">
              <Form.Label className='fw-semibold'>Email Notification</Form.Label>
              <Form.Check
                type="switch"
                id="customSwitch"
                className="custom-switch-lg"
              />
            </Form.Group>
            <Button 
            variant="link" 
            className='w-100 text-start p-3 pt-0 fw-semibold border-bottom' 
            style={{ textDecoration: 'none', color: 'inherit', borderRadius: "0" }}
            onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </Button>
            <Button 
            variant="link" 
            className='w-100 text-start text-danger p-3 fw-semibold border-bottom' 
            style={{ textDecoration: 'none', color: 'inherit', borderRadius: "0" }}
            >
              Delete Account
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <PasswordModal show={showPasswordModal} setShow={setShowPasswordModal} />
    </Container>
  )
}

export default Profile