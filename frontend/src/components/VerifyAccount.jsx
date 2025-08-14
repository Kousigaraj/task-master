import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
import useAuthStore from '../store/auth';
import { toast } from 'react-toastify';

const RESEND_OTP_TIME = 30; // seconds

const VerifyAccount = ({ show }) => {
  const { verifyAccount, sendVerifyOtp, getUserDetails, userData, updateEmail } = useAuthStore();

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState(userData.email);
  const [showChangeEmail, setShowChangeEmail] = useState(false);

  useEffect(() => {
    getUserDetails();
    if (!show) {
      setOtpSent(false);
      setOtp('');
      setTimer(0);
      setLoading(false);
      setShowChangeEmail(false);
    }
  }, [show]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    setLoading(true);
    const result = await sendVerifyOtp();
    setLoading(false);
    if (result.success) {
      setOtpSent(true);
      setTimer(RESEND_OTP_TIME);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const result = await sendVerifyOtp();
    setLoading(false);
    if (result.success) {
      setTimer(RESEND_OTP_TIME);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    const result = await verifyAccount(otp);
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setOtp('');
    setTimer(0);
  };

  const handleUpdateEmail = async () => {
    setLoading(true);
    const result = await updateEmail(newEmail);
    setLoading(false);
    if (result.success) {
      setNewEmail(userData.email);
      setShowChangeEmail(false);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="border-0 rounded shadow"
    >
      <Modal.Body className="p-4">
        <h4 className="mb-4 text-center fw-bold">
          {showChangeEmail ? "Update Email" : "Verify Your Account"}
        </h4>

        {!otpSent ? (
          <>
            {showChangeEmail ? (
              <Form>
                <Form.Group className="mb-4" controlId="formNewEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    autoFocus
                  />
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button variant="link" onClick={() => setShowChangeEmail(false)} disabled={loading}>
                    Back
                  </Button>
                  <Button onClick={handleUpdateEmail} variant='dark' disabled={loading || !newEmail}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Update"}
                  </Button>
                </div>
              </Form>
            ) : (
              <>
                <div className="mb-3 text-center">
                  <div className="mb-2">Verify your account to continue.</div>
                  <div>
                    <span className="fw-semibold">{userData.email}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-around">
                  <Button className='text-decoration-none' variant="link" onClick={() => setShowChangeEmail(true)}>
                    Change email
                  </Button>
                  <Button onClick={handleSendOtp} variant='dark' disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Send OTP"}
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="mb-3 text-center">
              <div className="mb-2">
                Enter the 6-digit OTP sent to <span className='fw-semibold'>{userData.email}</span>
              </div>
            </div>
            <Form>
              <Form.Group className="mb-3" controlId="formOtp">
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="text-center"
                  maxLength={6}
                  autoFocus
                />
              </Form.Group>
              <div className="mb-3 text-center">
                {timer > 0 ? (
                  <span className="text-muted small">Resend OTP in {timer}s</span>
                ) : (
                  <Button className='text-decoration-none' variant="link" onClick={handleResendOtp} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Resend OTP"}
                  </Button>
                )}
              </div>
              <div className="d-flex justify-content-around">
                <Button className='text-decoration-none' variant="link" onClick={() => setOtpSent(false)}>
                  Back
                </Button>
                <Button onClick={handleVerify} variant='dark' disabled={otp.length !== 6 || loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : "Verify"}
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default VerifyAccount;