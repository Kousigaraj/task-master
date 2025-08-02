import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { FiMenu } from "react-icons/fi";
import Button from 'react-bootstrap/Button';

const AppNavbar = ({ setIsOpen, isMobile }) => {
  return (
    <Container fluid className="p-0" style={{position: "fixed", top: 0, zIndex: 900}}>
      <Navbar expand="lg" className="bg-body-tertiary shadow-sm">
          <div className="d-flex align-items-center ms-3">
            {isMobile && <Button variant="light" className="text-decoration-none" onClick={() => setIsOpen(true)}>
              <FiMenu />
            </Button>}
            <Navbar.Brand className='ms-3 fw-semibold'>Task Master</Navbar.Brand>
          </div>
      </Navbar>
    </Container>
  )
}

export default AppNavbar