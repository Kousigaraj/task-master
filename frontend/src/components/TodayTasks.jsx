import { useTaskStore } from "../store/task";
import Card from 'react-bootstrap/Card';
import { FaRegCalendarAlt } from "react-icons/fa";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const TodayTasks = () => {
    const navigate = useNavigate();
    const {tasks} = useTaskStore();
    const today = new Date().toISOString().slice(0, 10);
    const todayTasks = tasks.filter(task => task.dueDate?.slice(0, 10) === today && !task.completed);
  return (
    <Card >
        <Card.Body>
            <Card.Title className='mb-3'>Today's Tasks</Card.Title>
            {todayTasks.length > 0 ? (
                <div className="d-flex flex-wrap gap-3">
                {todayTasks.map(task => (
                    <Card key={task._id} className="w-100">
                        <Card.Body>
                            <Row>
                                <Col md={10}>
                                    <Card.Title>{task.title}</Card.Title>
                                    <Card.Text>{task.description}</Card.Text>
                                </Col>
                                <Col md={2}>
                                    <p className='text-secondary'><FaRegCalendarAlt /> {new Date(task.dueDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}</p>
                                    <Button variant="primary" size="sm" onClick={() => navigate("/tasks")}>Manage Tasks</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
                </div>
            ) : (
                <p className="text-secondary">No tasks for today 🎉</p>
            )}
        </Card.Body>
    </Card>
  )
}

export default TodayTasks