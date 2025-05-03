import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../../services/api';
import styles from './ScenarioSelect.module.css';
import CreateScenarioForm from './CreateScenarioForm';

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

const ScenarioSelect = ({ modelId, onScenarioSelect, selectedScenario }) => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const response = await api.getScenarios(modelId);
      
      const formattedScenarios = response.results.map(scenario => ({
        value: scenario.id,
        label: scenario.name,
        description: scenario.description
      }));
      
      setScenarios(formattedScenarios);
      setError(null);
    } catch (err) {
      setError('Failed to fetch scenarios');
      console.error('Error fetching scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modelId) {
      fetchScenarios();
    }
  }, [modelId]);

  const handleScenarioChange = (selectedOption) => {
    if (onScenarioSelect) {
      onScenarioSelect(selectedOption);
    }
  };

  const handleAddScenario = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleScenarioCreated = (newScenario) => {
    fetchScenarios(); // Refresh the scenarios list
    setIsModalOpen(false);
  };

  const formatOptionLabel = ({ label, description }) => (
    <div>
      <div>{label}</div>
      {description && (
        <div style={{ fontSize: '0.8em', color: '#666' }}>
          {description}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.scenarioSelectContainer}>
      <div className={styles.selectWrapper}>
        <Select
          className={styles.select}
          options={scenarios}
          onChange={handleScenarioChange}
          value={selectedScenario}
          isLoading={loading}
          placeholder="Select a scenario..."
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
          onClick={handleAddScenario}
          className={styles.addButton}
        >
          Add Scenario
        </Button>
      </div>
      {error && <div className={styles.error}>{error}</div>}

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        aria-labelledby="create-scenario-modal"
      >
        <div className={styles.modalContent}>
          <h2>Create New Scenario</h2>
          <CreateScenarioForm 
            modelId={modelId}
            onSuccess={handleScenarioCreated} 
          />
        </div>
      </Modal>
    </div>
  );
};

export default ScenarioSelect; 