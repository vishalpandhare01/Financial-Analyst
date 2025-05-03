import React, { useState } from 'react';
import { api } from '../services/api';
import { BASE_URL } from '../config/baseUrl';
import styles from './LineItemUpload.module.css';

const LineItemUpload = ({ modelId, scenarioId, periodId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is an Excel file
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Please upload an Excel file (.xlsx or .xls)');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!scenarioId || !periodId) {
      setError('Please select both a scenario and period before uploading');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_id', modelId);
    formData.append('scenario_id', scenarioId);
    formData.append('period_id', periodId);

    try {
      const response = await fetch(`${BASE_URL}/line-item/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload line items');
      }

      setFile(null);
      setSuccess('Line items uploaded successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading line items:', error);
      setError(error.message || 'Failed to upload line items. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create example data
    const exampleData = [
      ['Name', 'Category', 'Amount'],
      ['Revenue', 'Income', '1000000'],
      ['Cost of Goods Sold', 'Expense', '500000'],
      ['Operating Expenses', 'Expense', '200000'],
      ['Interest Expense', 'Expense', '50000'],
      ['Tax Expense', 'Expense', '60000']
    ];

    // Convert to CSV
    const csvContent = exampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'line_items_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Upload Line Items</h3>
      
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

      <div className={styles.templateSection}>
        <h4 className={styles.templateTitle}>Need a template?</h4>
        <p className={styles.templateDescription}>
          Download our example spreadsheet template to see the required format.
        </p>
        <button
          onClick={handleDownloadTemplate}
          className={styles.templateButton}
        >
          Download Template
        </button>
      </div>

      <form onSubmit={handleUpload} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="file" className={styles.label}>
            Select Excel File
          </label>
          <input
            type="file"
            id="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={isUploading || !scenarioId || !periodId}
            className={styles.fileInput}
          />
          <p className={styles.helpText}>
            Supported formats: .xlsx, .xls, .csv
          </p>
        </div>

        <button
          type="submit"
          disabled={isUploading || !file || !scenarioId || !periodId}
          className={styles.submitButton}
        >
          {isUploading ? 'Uploading...' : 'Upload Line Items'}
        </button>
      </form>
    </div>
  );
};

export default LineItemUpload; 