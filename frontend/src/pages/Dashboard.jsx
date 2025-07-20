import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import StatusCard from '../components/StatusCard';
import { useTaskStore } from '../store/task';
import { useEffect } from 'react';
import OverallProgress from '../components/OverallProgress';
import TodayTasks from '../components/TodayTasks';


const Dashboard = () => {

  const {tasks, fetchTasks} = useTaskStore();

  useEffect(() => {
      fetchTasks();
    }, [fetchTasks]);

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && !task.completed);

  return (
      <Container className="p-3" style={{height: "100vh"}}>
        <h2>Dashboard</h2>
        <Row className='mt-3' sm={1} md={2} lg={4}>
          <Col className="mb-3" md={12} lg={12}>
            <Card>
              <Card.Body>
                <Card.Title>Welcome back, kousigaraj77!</Card.Title>
                <Card.Text className='text-secondary'>
                  Use the sidebar to navigate between your tasks, add new ones, or manage your profile. 
                  Your productivity dashboard shows a quick overview of your task progress.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col className="mb-2"><StatusCard text="Total Tasks" color="dark" count={tasks.length} /></Col>
          <Col className="mb-2"><StatusCard text="Completed" color="success" count={completedTasks.length} /></Col>
          <Col className="mb-2"><StatusCard text="Pending" color="warning" count={pendingTasks.length} /></Col>
          <Col className="mb-2"><StatusCard text="Overdue" color="danger" count={overdueTasks.length} /></Col>
          <Col className="mb-3 mt-2" md={12} lg={12}>
               <OverallProgress />
          </Col>
          <Col className="mb-3 mt-2" md={12} lg={12}>
               <TodayTasks />
          </Col>
        </Row>
      </Container>
  )
}

export default Dashboard;