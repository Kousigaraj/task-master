import Card from 'react-bootstrap/Card';
import { FiCheckSquare } from "react-icons/fi";


const StatusCard = ({text, color, count}) => {
  return (
    <Card style={{ width: '100%' }}>
      <Card.Body>
        <div className='d-flex justify-content-between align-items-center'>
            <h6>{text}</h6>
            <FiCheckSquare className={`text-${color}`}/>
        </div>
        <h3 className={`text-${color}`}>{count}</h3>
      </Card.Body>
    </Card>
  )
}

export default StatusCard