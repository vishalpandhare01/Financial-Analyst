import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BASE_URL } from '../config/baseUrl';
import styles from './LineItemForm.module.css';

const LineItemForm = ({ modelId, scenarioId, periodId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!scenarioId || !periodId) {
      setValidationError('Please select both a scenario and period before adding a line item');
    } else {
      setValidationError('');
    }
  }, [scenarioId, periodId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!scenarioId || !periodId) {
      setError('Please select both a scenario and period before adding a line item');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        model_id: modelId,
        scenario_id: scenarioId,
        period_id: periodId
      };

      const response = await fetch(`${BASE_URL}/line-item/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add line item');
      }

      setFormData({
        name: '',
        category: '',
        amount: '',
      });
      setSuccess('Line item added successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding line item:', error);
      setError(error.message || 'Failed to add line item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Line Item</h2>
      
      {validationError && (
        <div className={`${styles.alert} ${styles.alertWarning}`}>
          {validationError}
        </div>
      )}
      
      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          {error}
        </div>
      )}
      
      {success && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting || !scenarioId || !periodId}
            className={styles.input}
            placeholder="Enter line item name"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={isSubmitting || !scenarioId || !periodId}
            className={styles.input}
            placeholder="Enter category"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="amount" className={styles.label}>
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
            disabled={isSubmitting || !scenarioId || !periodId}
            className={styles.input}
            placeholder="Enter amount"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !scenarioId || !periodId}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Adding...' : 'Add Line Item'}
        </button>
      </form>
    </div>
  );
};

export default LineItemForm; 