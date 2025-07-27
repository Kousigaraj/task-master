import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AlertModel = ({ 
  showAlert, 
  setShowAlert, 
  alertData, 
  onConfirm, 
  confirmText = "Confirm", 
  cancelText = "Cancel"
}) => {

  const handleClose = () => setShowAlert(false);

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    setShowAlert(false);
  };

  return (
    <Modal className='p-3' size="sm" show={showAlert} onHide={handleClose} centered>
      <Modal.Body>
        <p className='text-center p-3'>{alertData.message}</p>
        <div className='d-flex justify-content-around'>
          <Button variant="secondary" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AlertModel