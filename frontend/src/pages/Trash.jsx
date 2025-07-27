import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useTaskStore } from '../store/task';
import TrashCards from '../components/TrashCards';
import Button from 'react-bootstrap/Button';
import AlertModel from '../components/AlertModel';
import { LuPaintbrush } from "react-icons/lu";


const Trash = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [isClearTrash, setClearTrash] = useState(false);
  const {trashedTasks, fetchTrashedTasks, setToastData, setShow} = useTaskStore();

  useEffect(() => {
    fetchTrashedTasks();
  },[fetchTrashedTasks]);

  const handleDeletePermenently = (tid) => {
    setClearTrash(false);
    setAlertData({
      message: "Are you sure you want to permanently delete this item?",
      tid: tid
    });
    setShowAlert(true);
  }

  const handleClearTrash = () => {
    if(trashedTasks.length == 0){
      setToastData({
        success: false,
        message: "No Tasks in trash."
      });
      setShow(true);
      return;
    }
    setClearTrash(true);
    setAlertData({
      message: "This will permanently delete all items in the trash."
    });
    setShowAlert(true);
  }

  return (
    <Container className="position-relative p-3 overflow-auto overflow-x-hidden" style={{height: "100vh"}}>
      <div className='d-flex w-100 justify-content-between'>
        <h2>Trash</h2>
        <Button variant="danger" size='sm' onClick={handleClearTrash}><LuPaintbrush className='me-2'/>Clear Trash</Button>
      </div>
      <p className="text-secondary">View and restore tasks you've previously deleted.</p>
      {trashedTasks.length > 0 ? (
        <div className="d-flex flex-wrap w-100 gap-3 m-3">
          {trashedTasks.map((trashedTask) =>( <TrashCards key={trashedTask._id} trashedTask={trashedTask} handleDeletePermenently={handleDeletePermenently}/> ))}
        </div>
      ):(
        <p className='text-secondary'>No trashed tasks found. Everything looks clean!</p>
      )}
      <AlertModel 
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        alertData={alertData}
        onConfirm={async () => {
          let result;
          if (!isClearTrash && alertData.tid) {
            result = await deleteTask(alertData.tid);
          } else {
            result = await clearTrash();
          }
          setToastData({
            success: result.success,
            message: result.message,
          });
          setShow(true);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />

    </Container>
  )
}

export default Trash