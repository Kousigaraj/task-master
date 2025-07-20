import { FaPlus } from "react-icons/fa";
import styles from './createtask.module.css'


const CreateTaskButton = ({handleShow}) => {
  return (
    <button className={`${styles.button} btn btn-dark position-fixed bottom-0 end-0 m-5 shadow`}
    onClick={handleShow}
    >
        <FaPlus />
    </button>
  )
}

export default CreateTaskButton