import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useTaskStore } from '../store/task';

const Tost = () => {

  const {toastData, show, setShow} = useTaskStore();
    
  return (
    <ToastContainer
          className="p-3"
          position={'bottom-center'}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
        >
        <Toast 
            onClose={() => setShow(false)} 
            show={show} 
            delay={2000}
            bg={toastData.success ? 'success' : 'danger'} 
            autohide
            >
            <Toast.Header>
                <strong className="me-auto">{toastData.success ? 'Success': 'Error' }</strong>
            </Toast.Header>
            <Toast.Body >{toastData.message}</Toast.Body>
        </Toast>
    </ToastContainer>
  )
}

export default Tost