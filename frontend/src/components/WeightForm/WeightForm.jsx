import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as weightActions from '../../store/weight'
import './WeightForm.css'

const WeightForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await dispatch(weightActions.createWeight(data.weight));
      await dispatch(weightActions.fetchWeights())
      reset();
      setSuccessMessage("Weight Logged!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 3000)

    } catch (err) {
      return err;
    }
  };

  return (
    <>
        {successMessage && (
            <div className="success-message">{successMessage}</div>
        )}
        <form className='weight-form' onSubmit={handleSubmit(onSubmit)}>
            <div className="weight-form-div">
            <label className='weight-log-label' htmlFor="weight">Enter your weight:</label>
            <input
            className="weight-log-input"
                type="number"
                id="weight"
                placeholder="Weight in pounds"
                {...register("weight", {
                required: "Weight is required",
                min: { value: 1, message: "Weight must be greater than 0" },
                })}
            />

            <button className="weight-log-form-button" type="submit">Log Weight</button>
            </div>
            {errors.weight && <p className='landing-page-error'>{errors.weight.message}</p>}

        </form>
    </>

  );
};

export default WeightForm;
