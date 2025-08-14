import { useState, useRef, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth';
import { toast } from 'react-toastify';

const OTP_LENGTH = 6;
const OTP_TIMER = 60; // seconds

const ResetPassword = () => {
  const { sendResetOtp, verifyOtp, resetPassword } = useAuthStore();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(OTP_TIMER);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const timerRef = useRef();

  const navigate = useNavigate();

  // Timer for OTP
  useEffect(() => {
    if (step === 2 && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer, step]);

  // Handlers
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await sendResetOtp(email);
    if (result.success) {
      toast.success(result.message);
      setStep(2);
      setTimer(OTP_TIMER);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const result = await sendResetOtp(email);
    if (result.success) {
      toast.success(result.message);
      setTimer(OTP_TIMER);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await verifyOtp(email, otp);
    if (result.success) {
      toast.success(result.message);
      setStep(3);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }
    const result = await resetPassword(email, otp, password);
    if (result.success) {
      toast.success(result.message);
      setStep(4);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  // UI
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #888888 0%, #ffffff 100%)' }}
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <div className="p-5 rounded bg-white shadow">
            <h2 className="text-center">Reset Password</h2>
            <p className="mb-4 text-center text-secondary" style={{ fontSize: '1rem' }}>
              Enter your registered email address to receive a one-time password (OTP). Follow the steps to reset your password securely.
            </p>
            {step === 1 && (
              <Form onSubmit={handleSendOtp}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className='d-flex justify-content-between'>
                  <Button className='text-decoration-none' onClick={() => navigate('/login')}  variant="link" type="button">
                    Back
                  </Button>
                  <Button variant="dark" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Next'}
                  </Button>
                </div>
              </Form>
            )}
            {step === 2 && (
              <Form onSubmit={handleVerifyOtp}>
                <Form.Group className="mb-3" controlId="formOtp">
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={OTP_LENGTH}
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
                    required
                  />
                  <div className="mt-2 text-muted">
                    {timer > 0 ? (
                      <>Resend OTP in {timer}s</>
                    ) : (
                      <Button variant="link" onClick={handleResendOtp} disabled={loading}>
                        Resend OTP
                      </Button>
                    )}
                  </div>
                </Form.Group>
                <div className='d-flex justify-content-between'>
                  <Button className='text-decoration-none' onClick={() => setStep(1)} variant="link" type="button">
                    Back
                  </Button>
                  <Button variant="dark" type="submit" disabled={loading || otp.length !== OTP_LENGTH}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Verify OTP'}
                  </Button>
                </div>
              </Form>
            )}
            {step === 3 && (
              <Form onSubmit={handleResetPassword}>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className='d-flex justify-content-between'>
                  <Button onClick={() => setStep(2)} variant="link" type="button">
                    Back
                  </Button>
                  <Button variant="dark" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
                  </Button>
                </div>
              </Form>
            )}
            {step === 4 && (
              <div className="text-center">
                <h5>Password reset successful!</h5>
                <Button variant="dark" onClick={() => navigate('/login')} className="mt-3">
                  Go to Login
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPassword;