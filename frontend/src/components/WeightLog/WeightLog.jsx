

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as weightActions from '../../store/weight';
import './WeightLog.css';
import WeightForm from '../WeightForm/WeightForm';

const WeightLog = () => {
  const dispatch = useDispatch();


  const weights = useSelector((state) => state.weights.weights);


  const [editingWeightId, setEditingWeightId] = useState(null);
  const [newWeight, setNewWeight] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const getWeights = async () => {
      await dispatch(weightActions.fetchWeights());
    };
    getWeights();
  }, [dispatch]);


  const handleDelete = async (weightId) => {
    try {
        await dispatch(weightActions.deleteWeight(weightId));
        setSuccessMessage('Weight log deleted successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        setTimeout(() => {
            setSuccessMessage('Something went wrong');
          }, 3000);
      }
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


  const getTrend = (currentWeight, previousWeight) => {
    if (currentWeight > previousWeight) {
      return 'up';
    } else if (currentWeight < previousWeight) {
      return 'down';
    } else {
      return 'neutral';
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="weight-log">

    {successMessage && (
            <div className="delete-success-message">{successMessage}</div>
        )}
      <Link to="/home" className="back-button">Back to Dashboard</Link>
      <h2>Your Weight Log</h2>

      <button
        className="log-weight-button"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? '-' : '+'}
      </button>


      <div className={`form-container ${showForm ? "show" : "hide"}`}>
        {showForm && <WeightForm onClose={handleCloseForm}/>}
      </div>
      {weights.length > 0 ? (
        <ul>
          {weights.map((weight, index) => {
            const previousWeight = index > 0 ? weights[index - 1].weight : weight.weight;
            const trend = getTrend(weight.weight, previousWeight);

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

                {/* <span className={`weight-trend ${trend}`}>
                  {trend === 'up' && '↑'}
                  {trend === 'down' && '↓'}
                  {trend === 'neutral' && '→'}
                </span> */}

                <button
                  className="delete-button"
                  onClick={() => handleDelete(weight.id)}
                >
                  <img src="https://cdn-icons-png.flaticon.com/512/860/860829.png" alt="Delete" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No weight entries found.</p>
      )}
    </div>
  );
};

export default WeightLog;
