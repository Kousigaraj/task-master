import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useTaskStore } from '../store/task';
import { TbTrashXFilled } from "react-icons/tb";
import { FaRedoAlt } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { toast } from 'react-toastify';

const TrashCards = ({ trashedTask, handleDeletePermenently }) => {
  const { restoreTask } = useTaskStore();

  const handleRestore = async (tid) => {
    const result = await restoreTask(tid);
    if(result.success){
      toast.success(result.message);
    } else{
      toast.error(result.message);
    }
  };

  let remainingDays = '-';
  if (trashedTask?.deletedAt) {
    const deletedAt = new Date(trashedTask.deletedAt);
    if (!isNaN(deletedAt.getTime())) {
      const autoDeleteDate = new Date(deletedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const diffTime = autoDeleteDate - now;
      remainingDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    }
  }

  const colorClass =
    remainingDays !== '-' && remainingDays <= 3
      ? 'text-danger'
      : remainingDays <= 7
      ? 'text-warning'
      : 'text-secondary';

  return (
    <Card style={{ width: '95%' }}>
      <Card.Body>
        <Row>
          <Col md={8} lg={10}>
            <Card.Title>{trashedTask.title}</Card.Title>
            <Card.Text>{trashedTask.description}</Card.Text>
          </Col>
          <Col md={4} lg={2} className='d-flex justify-content-end align-items-end flex-column gap-2'>
            <div className={`d-flex justify-content-center align-items-center ${colorClass}`}>
              <FaClockRotateLeft />
              <span className='ms-2'>{`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`}</span>
            </div>
            <div className='d-flex justify-content-end gap-3'>
              <Button variant="secondary" size='sm' style={{ fontSize: "18px" }} onClick={() => handleRestore(trashedTask._id)}><FaRedoAlt /></Button>
              <Button variant="danger" style={{ fontSize: "18px" }} size='sm' onClick={() => handleDeletePermenently(trashedTask._id)}><TbTrashXFilled /></Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TrashCards;
