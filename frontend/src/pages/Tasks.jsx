import CreateTaskButton from "../components/CreateTaskButton"
import { useEffect, useState } from "react";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskCards from "../components/TaskCards";
import { useTaskStore } from "../store/task";
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

const Tasks = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    setSelectedTask(null);
    setIsEdit(false);
    setShowModal(false);
  }
  const handleShow = () => {
    setShowModal(true);
    setIsEdit(false);
  }

  const {fetchTasks, tasks} = useTaskStore();

  useEffect(() => {
    const fetchAllTasks = async () => {
      setLoading(true);
      await fetchTasks();
      setLoading(false);
    };
    fetchAllTasks();
  }, [fetchTasks]);

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const pendingTasks = sortedTasks.filter(task => !task.completed);
  const completedTasks = sortedTasks.filter(task => task.completed);

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{height: "93vh"}}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="position-relative mt-5 p-3 overflow-auto overflow-x-hidden" style={{height: "93vh"}}>
      <h2>Tasks</h2>
      <p className="text-secondary">Manage and track your daily tasks.</p>
      {tasks.length > 0 ? (
        <>
        {pendingTasks.length > 0 &&
          <>
          <h5 className=" m-3">Pending Tasks</h5>
          <div className="d-flex flex-wrap w-100 gap-3 m-3">
            {pendingTasks.map((task) =>( <TaskCards key={task._id} task={task} 
            setShowModal={setShowModal} setIsEdit={setIsEdit} setSelectedTask={setSelectedTask}/>))}
          </div>
          </>
        }
        {completedTasks.length > 0 &&
          <>
          <h5 className=" mt-4 m-3">Completed Tasks</h5>
          <div className="d-flex flex-wrap w-100 gap-3 m-3">
            {completedTasks.map((task) => ( <TaskCards key={task._id} task={task} 
            setShowModal={setShowModal} setIsEdit={setIsEdit} setSelectedTask={setSelectedTask}/>))}
          </div>
          </>
        }
        </>
      ) : (<p className="text-secondary">No tasks found.</p>)}
      <CreateTaskModal
        showModal={showModal}
        handleClose={handleClose}
        setShowModal={setShowModal}
        isEdit={isEdit}
        existingTask={selectedTask}
      />
      <CreateTaskButton handleShow={handleShow}/>
    </Container>
  )
}

export default Tasks