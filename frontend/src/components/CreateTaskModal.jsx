import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTaskStore } from "../store/task";

const CreateTaskModal = ({ showModal,setShowModal, handleClose, isEdit, existingTask}) => {
  const [newTask, setNewTask] = useState({
      title: "",
      description: "",
      dueDate: "",
    });

  const {createTask, updateTask, setToastData, setShow} = useTaskStore();

  useEffect(() => {
    if (isEdit && existingTask) {
      setNewTask(existingTask);
    }
  }, [isEdit, existingTask]);

  useEffect(() => {
    if (!showModal) {
      setNewTask({ title: "", description: "", dueDate: "" });
    }
  }, [showModal]);

  const handleSubmit = async () => {
    let result;
    if (isEdit && existingTask) {
      result = await updateTask(existingTask._id, newTask);
    } else {
      result = await createTask(newTask);
      setNewTask({ title: "", description: "", dueDate: "" });
    }

    setToastData({
      success: result.success,
      message: result.message,
    });

    if (result.success) {
      setShowModal(false);
      setShow(true);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Edit Task" : "Create New Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formTaskTitle">
            <Form.Label>Task Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              autoFocus
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTaskDescription">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              placeholder="Enter task description"
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTaskDueDate">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
               value={newTask.dueDate ? newTask.dueDate.slice(0, 10) : ""}
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" 
        onClick={handleSubmit} 
        disabled={!newTask.title || !newTask.dueDate} 
        >
          {isEdit ? "Update Task" : "Add Task"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTaskModal;
