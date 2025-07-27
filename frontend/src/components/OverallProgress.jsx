import { ProgressBar } from 'react-bootstrap';
import { useTaskStore } from '../store/task';
import Card from 'react-bootstrap/Card';

const OverallProgress = () => {

    const {tasks} = useTaskStore();
    const completedTasks = tasks.filter(task => task.completed);
    const percentage = Math.floor((completedTasks.length/tasks.length) * 100);
  return (
    <Card >
        <Card.Body>
            <Card.Title className='mb-3'>Overall Progress({percentage ? percentage : 0}%)</Card.Title>
            <ProgressBar striped variant="primary" now={percentage} /> 
        </Card.Body>  
    </Card> 
  )
}

export default OverallProgress