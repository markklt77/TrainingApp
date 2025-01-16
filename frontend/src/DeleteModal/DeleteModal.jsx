import { useDispatch } from "react-redux";
import { useModal } from "../context/Modal";
import { useNotification } from "../context/NotificationContext";
import './DeleteModal.css';



function DeleteModal({ entityIds, entityType, deleteAction }) {

    const dispatch = useDispatch();
    const { showNotification } = useNotification();
    const { closeModal } = useModal();

    const handleDelete = async () => {
        try {
            if (entityType === 'Weight Log') {
                await dispatch(deleteAction(entityIds.weightId));
            } else if (entityType === 'Set') {
                await dispatch(deleteAction(entityIds.workoutId, entityIds.exerciseId, entityIds.setId));
            } else if (entityType === 'Exercise') {
                await dispatch(deleteAction(entityIds.workoutId, entityIds.exerciseId));
            } else if (entityType === 'Workout') {
                deleteAction()
            }

            showNotification(`${entityType} deleted!`, 'delete')
        } catch {
            showNotification(`Failed to delete ${entityType}`, 'delete')
        }
        closeModal()
    }

    return (
        <div className="delete-modal-div">
            <div className="delete-modal-statement-div">
                <p className="delete-modal-statement">Delete this <span className="delete-modal-type">{entityType}</span> ?</p>
            </div>

            <div className="delete-modal-button-div">
                <button className="delete-modal-button" onClick={() => handleDelete()}>Yes</button>
                <button className="cancel-delete-modal-button" onClick={closeModal}>No</button>
            </div>


        </div>
    )
}

export default DeleteModal;
