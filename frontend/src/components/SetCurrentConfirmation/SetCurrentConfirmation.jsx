import './SetCurrentConfirmation.css';
import { useDispatch } from 'react-redux';
import { useNotification } from "../../context/NotificationContext";
import { useModal } from '../../context/Modal';

function SetCurrentConfirmation ({entityId, finish, action}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const { showNotification } = useNotification();

    const handleConfirm = async () => {
        await dispatch(action(entityId));
        closeModal()
        showNotification(finish? "Workout set as Current!" : "Workout Finished!", "success");

    }

    return (
        <div className="confirmation-div">
            <div className="modal-statement-div"></div>
            {finish?
            <p className='modal-statement'>Set this workout as Current?</p>
             : <p className='modal-statement'>Finish Workout?</p>}
             <div className="modal-confirm-button-div">
                <button onClick={handleConfirm} className="confirm">Yes</button>
                <button onClick={closeModal} className="decline">No</button>
             </div>

        </div>
    )
}

export default SetCurrentConfirmation;
