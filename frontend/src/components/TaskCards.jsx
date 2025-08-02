import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useTaskStore } from '../store/task';
import { FaRegTrashCan } from "react-icons/fa6";
import { FaEdit, FaRegCalendarAlt } from "react-icons/fa";
import { toast } from 'react-toastify';

const TaskCards = ({ task, setShowModal, setIsEdit, setSelectedTask }) => {
  const { trashTask, updateTaskStatus } = useTaskStore();

  const handleTrash = async () => {
    const result = await trashTask(task._id);
    if(result.success){
      toast.success(result.message);
    } else{
      toast.error(result.message);
    }
  };

  const handleEdit = () => {
    setSelectedTask(task);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleToggleStatus = async (e) => {
    const result = await updateTaskStatus(task._id, e.target.checked);
    if(result.success){
      toast.success(result.message);
    } else{
      toast.error(result.message);
    }
  };

  return (
    <Card style={{ width: '90%' }}>
      <Card.Body>
        <Row>
          <Col md={8} lg={10}>
            <Card.Title className={task.completed ? "text-decoration-line-through text-muted" : ""}>
              <Form.Check
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleStatus}
                label={
                  <span className={task.completed ? "text-decoration-line-through text-secondary" : ""} >{task.title}</span>}
              />
            </Card.Title>
            <Card.Text className={task.completed ? "text-decoration-line-through text-secondary" : ""}>{task.description}</Card.Text>
          </Col>
          <Col md={4} lg={2} className='d-flex justify-content-center align-items-end flex-column gap-2'>
          <div className='d-flex justify-content-center align-items-center text-secondary'>
            <FaRegCalendarAlt className='me-2' />
            {task.dueDate && (
                <span>
                  {new Date(task.dueDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
          </div>
            <div className='d-flex justify-content-end gap-3'>
              <Button variant="warning" style={{ fontSize: "18px" }} size="sm" onClick={handleEdit}>
                <FaEdit />
              </Button>
              <Button variant="danger" style={{ fontSize: "18px" }} size="sm" onClick={handleTrash}>
                <FaRegTrashCan />
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TaskCards;
