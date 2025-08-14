import { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {register, isAuthenticated, checkAuth, login} = useAuthStore();

  useEffect(() => {
    const check = async () => {
      await checkAuth();
      setCheckingAuth(false);
    };
    check();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!checkingAuth && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, checkingAuth, navigate]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    if(state === 'Sign Up'){
      const result = await register(name, email, password, confirmPassword);
      setLoading(false);
      if(result.success){
        toast.success(result.message);
        navigate('/');
      } else{
        toast.error(result.message);
      }
    } else if(state === 'Login'){
      const result = await login(email, password);
      setLoading(false);
      if(result.success){
        toast.success(result.message);
        navigate('/');
      } else{
        toast.error(result.message);
      }
    }
  }

  if (checkingAuth) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #888888 0%, #ffffff 100%)' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Checking authentication...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #888888 0%, #ffffff 100%)' }}
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <div className="p-5 rounded bg-white shadow">
            <h2 className="text-center mb-1 fw-bold" >
              {state === 'Login' ? 'Welcome Back!' : 'Join Us'}
            </h2>
            <p className="text-secondary text-center mb-4">
              {state === 'Login' ? 'Login to your account' : 'Create your account'}
            </p>

            <Form onSubmit={handleSubmit}>
              {state === 'Sign Up' && (
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control 
                  type="text" 
                  placeholder="Enter your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  />
                </Form.Group>
              )}

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                />
              </Form.Group>

              {state === 'Sign Up' && (
                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control 
                  type="password" 
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  />
                </Form.Group>
              )}

              {state === 'Login' && (
                <div className="d-flex justify-content-end mb-3">
                  <a onClick={() => navigate('/reset-password')} className="text-decoration-none text-primary" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                    Forgot Password?
                  </a>
                </div>
              )}

              <Button variant="dark" type="submit" className="w-100 py-2 fw-semibold" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    {state}
                  </>
                ) : (
                  state
                )}
              </Button>

              <div className="text-center mt-4">
                {state === 'Login' ? (
                  <>
                    <span>Don't have an account? </span>
                    <a onClick={() => setState('Sign Up')} className="text-decoration-none text-primary" style={{ cursor: 'pointer' }}>
                      Sign Up
                    </a>
                  </>
                ) : (
                  <>
                    <span>Already have an account? </span>
                    <a onClick={() => setState('Login')} className="text-decoration-none text-primary" style={{ cursor: 'pointer' }}>
                      Login here
                    </a>
                  </>
                )}
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
