

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as weightActions from '../../store/weight';
import './WeightLog.css';
import WeightForm from '../WeightForm/WeightForm';
import OpenModalButton from '../OpenModalButton';
import DeleteModal from '../../DeleteModal';

const WeightLog = () => {
  const dispatch = useDispatch();
  const weights = useSelector((state) => state.weights.weights);

  const [editingWeightId, setEditingWeightId] = useState(null);
  const [newWeight, setNewWeight] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const getWeights = async () => {
      await dispatch(weightActions.fetchWeights());
    };
    getWeights();
  }, [dispatch]);

  const paginate = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(weights.length / itemsPerPage)));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSave = async (weightId) => {
    if (newWeight) {
      await dispatch(weightActions.updateWeightById(weightId, newWeight));
      setEditingWeightId(null);
      setNewWeight('');
    }
  };

  const handleCancel = () => {
    setEditingWeightId(null);
    setNewWeight('');
  };

  const handleChange = (event) => {
    setNewWeight(event.target.value);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const paginatedWeights = paginate(weights);

  return (
    <div className="weight-log">
      <div className='create-workout-link-div'>
        <Link to="/home" className="back-button">Back to Dashboard</Link>
      </div>
      <h2>Your Weight Log</h2>

      <button
        className="log-weight-button"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? '-' : '+'}
      </button>

      <div className={`form-container ${showForm ? "show" : "hide"}`}>
        {showForm && <WeightForm onClose={handleCloseForm} />}
      </div>

      {weights.length > 0 ? (
        <>
          <ul>
            {paginatedWeights.map((weight) => {

              return (
                <li key={weight.id} className="weight-item">
                  <span className="weight-date">
                    {new Date(weight.createdAt).toLocaleDateString()}
                  </span>

                  {editingWeightId === weight.id ? (
                    <div className="edit-container">
                      <input
                        type="number"
                        value={newWeight}
                        onChange={handleChange}
                        placeholder={weight.weight}
                      />
                      <button className='weight-log-button' onClick={() => handleSave(weight.id)}>Save</button>
                      <button className='weight-log-button' onClick={handleCancel}>Cancel</button>
                    </div>
                  ) : (
                    <span
                      className="weight-value"
                      onClick={() => {
                        setEditingWeightId(weight.id);
                        setNewWeight(weight.weight);
                      }}
                    >
                      {weight.weight} lbs
                    </span>
                  )}

                  <OpenModalButton
                    modalComponent={<DeleteModal entityIds={{ weightId: weight.id }} entityType={"Weight Log"} deleteAction={weightActions.deleteWeight} />}
                    buttonText={<img src="https://cdn-icons-png.flaticon.com/512/860/860829.png" alt="Delete" />}
                    cName={"delete-button"}
                  />
                </li>
              );
            })}
          </ul>

          <div className="pagination-controls">
            <button
              className="next-prev-button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="next-prev-button"
              onClick={handleNextPage}
              disabled={currentPage * itemsPerPage >= weights.length}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No weight entries found.</p>
      )}
    </div>
  );
};

export default WeightLog;
