import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTaskStore } from '../store/task';

const AlertModel = ({showAlert, setShowAlert, alertData, isClearTrash}) => {
    const {deleteTask, setToastData, setShow, clearTrash} = useTaskStore();

    const handleClose = () => setShowAlert(false);

    const handleDeleteTasks = async() => {
        let result;
        if(!isClearTrash && alertData.tid){
            result = await deleteTask(alertData.tid);
        } else{
            result = await clearTrash();
        }
        setToastData({
            success: result.success,
            message: result.message,
        });
        setShowAlert(false);
        setShow(true);
    };

  return (
      <Modal className='p-3' size="sm" show={showAlert} onHide={handleClose} centered>
        <Modal.Body>
            <p className='text-center p-3'>{alertData.message}</p>
            <div className='d-flex justify-content-around'>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteTasks}>
                    Delete
                </Button>
            </div>
        </Modal.Body>
      </Modal>
  )
}

export default AlertModel