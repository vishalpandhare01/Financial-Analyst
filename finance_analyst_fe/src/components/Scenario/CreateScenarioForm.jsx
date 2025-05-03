import React, { useState } from 'react';
import styles from './CreateScenarioForm.module.css';
import { api } from '../../services/api';

const CreateScenarioForm = ({ modelId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model_id: modelId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const payload = {
        name: formData.name,
        description: formData.description,
        model_id: modelId
      };

      const response = await api.createScenario(payload);
      setFormData({
        name: '',
        description: '',
        model_id: modelId
      });
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      if (error.name === 'ApiError') {
        // Handle specific API errors
        if (error.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else if (error.status === 400) {
          // Handle validation errors
          const errorMessage = error.data?.message || 'Invalid form data';
          setError(errorMessage);
        } else {
          setError(error.message || 'Failed to create scenario');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error creating scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createScenarioForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Scenario Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Base Case"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter scenario description..."
            className={styles.textarea}
          />
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Scenario'}
        </button>
      </form>
    </div>
  );
};

export default CreateScenarioForm; 