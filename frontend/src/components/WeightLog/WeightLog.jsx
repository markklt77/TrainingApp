import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as weightActions from '../../store/weight';

const WeightLog = () => {
  const dispatch = useDispatch();

  // Fetch weights from Redux store
  const weights = useSelector((state) => state.weights.weights);

  // Local state for editing weight
  const [editingWeightId, setEditingWeightId] = useState(null);
  const [newWeight, setNewWeight] = useState('');

  // Fetch weights when component is mounted
  useEffect(() => {
    const getWeights = async () => {
      await dispatch(weightActions.fetchWeights());
    };
    getWeights();
  }, [dispatch]);

  // Handle delete of a weight
  const handleDelete = async (weightId) => {
    await dispatch(weightActions.deleteWeight(weightId));
  };

  // Handle weight update
  const handleSave = async (weightId) => {
    if (newWeight) {
      await dispatch(weightActions.updateWeightById(weightId, newWeight));
      setEditingWeightId(null);
      setNewWeight('');
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingWeightId(null);
    setNewWeight('');
  };

  // Handle change in input field for weight
  const handleChange = (event) => {
    setNewWeight(event.target.value);
  };

  return (
    <div className="weight-log">
      <h2>Your Weight Log</h2>
      {weights.length > 0 ? (
        <ul>
          {weights.map((weight) => (
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
                  <button onClick={() => handleSave(weight.id)}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              ) : (
                <span
                  className="weight-value"
                  onClick={() => {
                    setEditingWeightId(weight.id);
                    setNewWeight(weight.weight); // Pre-fill the input with the current weight
                  }}
                >
                  {weight.weight} lbs
                </span>
              )}

              <button
                className="delete-button"
                onClick={() => handleDelete(weight.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No weight entries found.</p>
      )}
    </div>
  );
};

export default WeightLog;
