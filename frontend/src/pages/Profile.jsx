import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import './profile.css';
import { MdEdit } from "react-icons/md";
import PasswordModal from '../components/PasswordModal';
import profilePic from '../assets/default-profile.jpg';
import { useAuthStore } from '../store/auth';
import { toast } from 'react-toastify';
import AlertModel from '../components/AlertModel';
import Spinner from 'react-bootstrap/Spinner';

const Profile = () => {
  const { userData, getUserDetails, updateUserData, deleteUserAccount } = useAuthStore();
  const [isEdit, setIsEdit] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
  });
  const [emailNotification, setEmailNotification] = useState(userData?.emailNotification || false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      await getUserDetails();
      setLoading(false);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    setUserDetails({
      name: userData?.name || "",
      email: userData?.email || "",
    });
    setEmailNotification(userData?.emailNotification || false);
  }, [userData]);

  const handleEdit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      // Check if any field changed
      const emailChanged = userDetails.email !== userData?.email;
      const nameChanged = userDetails.name !== userData?.name;
      const notificationChanged = emailNotification !== userData?.emailNotification;

      if (emailChanged || nameChanged || notificationChanged) {
        setLoading(true);
        const isAccountVerified = emailChanged ? false : userData?.isAccountVerified;
        const { success, message } = await updateUserData(
          userDetails.name,
          userDetails.email,
          emailNotification,
          isAccountVerified
        );
        setLoading(false);
        if (success) {
          toast.success(message);
        } else {
          toast.error(message);
          setUserDetails({
            name: userData?.name || "",
            email: userData?.email || "",
          });
          setEmailNotification(userData?.emailNotification || false);
        }
      }
    }
    setIsEdit(prev => !prev);
  };

  const handleDeleteAccount = async () => {
    setAlertData({
      message: "Are you sure you want to permanently delete this account?"
    });
    setShowAlert(true);
  }

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{height: "93vh"}}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="p-3 mt-5" style={{height: "93vh"}}>
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
            <Row>
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
            <Form.Group className="mb-3 d-flex justify-content-start mt-2" controlId="customSwitch">
              <Form.Label className='fw-semibold me-3 p-1'>Email Notification</Form.Label>
              <Form.Check
                type="switch"
                id="customSwitch"
                checked={emailNotification}
                onChange={(e) => setEmailNotification(e.target.checked)}
                className="custom-switch-lg"
                disabled={!isEdit}
              />
            </Form.Group>
            <Button 
              variant="dark" 
              onClick={(e) => handleEdit(e)}
              type='submit'
              className='d-flex align-items-center'
              disabled={loading}
            >
              {loading ? <Spinner size="sm" animation="border" className="me-2" /> : null}
              {!isEdit ? <><MdEdit className='me-1'/> <span>Edit</span></> : "Save Changes"}
            </Button>
          </Form>
          <Form>
            <Button 
              variant="link" 
              className='w-100 text-start p-3  mt-3 fw-semibold border-bottom border-top' 
              style={{ textDecoration: 'none', color: 'inherit', borderRadius: "0" }}
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </Button>
            <Button 
              variant="link" 
              className='w-100 text-start text-danger p-3 fw-semibold border-bottom' 
              style={{ textDecoration: 'none', color: 'inherit', borderRadius: "0" }}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <PasswordModal show={showPasswordModal} setShow={setShowPasswordModal} />
      <AlertModel 
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertData={alertData}
        onConfirm={async () => {
          setLoading(true);
          const result = await deleteUserAccount();
          setLoading(false);
          if(result.success){
            toast.success(result.message);
          } else{
            toast.error(result.message);
          }
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Container>
  )
}

export default Profile;