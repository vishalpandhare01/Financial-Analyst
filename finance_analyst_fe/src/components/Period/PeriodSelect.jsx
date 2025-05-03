import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button, Tooltip, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../../services/api';
import styles from './PeriodSelect.module.css';
import CreatePeriodForm from './CreatePeriodForm';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const customStyles = {
  control: (base) => ({
    ...base,
    background: 'white',
    borderColor: '#e0e0e0',
    '&:hover': {
      borderColor: '#1976d2'
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: '#333'
  }),
  input: (base) => ({
    ...base,
    color: '#333'
  }),
  placeholder: (base) => ({
    ...base,
    color: '#666'
  }),
  menu: (base) => ({
    ...base,
    background: 'white',
    zIndex: 9999
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#1976d2' : state.isFocused ? '#f5f5f5' : 'white',
    color: state.isSelected ? 'white' : '#333',
    '&:hover': {
      backgroundColor: state.isSelected ? '#1976d2' : '#f5f5f5'
    }
  })
};

const PeriodSelect = ({ onPeriodSelect, selectedPeriod }) => {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const response = await api.getPeriods();
      
      const formattedPeriods = response.results.map(period => ({
        value: period.id,
        label: period.label,
        start_date: period.start_date,
        end_date: period.end_date,
        period_type: period.period_type,
        dateRange: `${formatDate(period.start_date)} - ${formatDate(period.end_date)}`
      }));
      
      setPeriods(formattedPeriods);
      setError(null);
    } catch (err) {
      setError('Failed to fetch periods');
      console.error('Error fetching periods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const handlePeriodChange = (selectedOption) => {
    if (onPeriodSelect) {
      console.log('Selected period:', selectedOption);
      onPeriodSelect(selectedOption);
    }
  };

  const handleAddPeriod = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePeriodCreated = (newPeriod) => {
    fetchPeriods(); // Refresh the periods list
    setIsModalOpen(false);
  };

  const formatOptionLabel = ({ label, dateRange, period_type }) => (
    <div>
      <div>{label}</div>
      <div style={{ fontSize: '0.8em', color: '#666' }}>
        {dateRange} ({period_type})
      </div>
    </div>
  );

  return (
    <div className={styles.periodSelectContainer}>
      <div className={styles.selectWrapper}>
        <Select
          className={styles.select}
          options={periods}
          onChange={handlePeriodChange}
          value={selectedPeriod}
          isLoading={loading}
          placeholder="Select a period..."
          isSearchable
          isClearable
          styles={customStyles}
          formatOptionLabel={formatOptionLabel}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: '#1976d2',
              primary75: '#1976d2',
              primary50: '#1976d2',
              primary25: '#f5f5f5'
            }
          })}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddPeriod}
          className={styles.addButton}
        >
          Add Period
        </Button>
      </div>
      {error && <div className={styles.error}>{error}</div>}

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="create-period-modal"
      >
        <div className={styles.modalContent}>
          <h2>Create New Period</h2>
          <CreatePeriodForm onSuccess={handlePeriodCreated} />
        </div>
      </Modal>
    </div>
  );
};

export default PeriodSelect; 