import React, { useState } from 'react';
import styles from './CreatePeriodForm.module.css';
import { api } from '../../services/api';

const CreatePeriodForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    label: '',
    start_date: '',
    end_date: '',
    period_type: 'quarterly'
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
        label: formData.label,
        start_date: formData.start_date,
        end_date: formData.end_date,
        period_type: formData.period_type
      };

      const response = await api.createPeriod(payload);
      setFormData({
        label: '',
        start_date: '',
        end_date: '',
        period_type: 'quarterly'
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
          setError(error.message || 'Failed to create period');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error creating period:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createPeriodForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="label" className={styles.label}>Period Label</label>
          <input
            type="text"
            id="label"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g., Q2 2025"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="start_date" className={styles.label}>Start Date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className={`${styles.input} ${styles.dateInput}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="end_date" className={styles.label}>End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className={`${styles.input} ${styles.dateInput}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="period_type" className={styles.label}>Period Type</label>
          <select
            id="period_type"
            name="period_type"
            value={formData.period_type}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Period'}
        </button>
      </form>
    </div>
  );
};

export default CreatePeriodForm; 