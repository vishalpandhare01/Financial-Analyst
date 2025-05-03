import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import styles from './ScenariosList.module.css';

const ScenariosList = ({ modelId }) => {
    const [scenarios, setScenarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        model_id: modelId
    });

    useEffect(() => {
        fetchScenarios();
    }, [modelId]);

    const fetchScenarios = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getScenarios(modelId);
            setScenarios(response.results);
        } catch (error) {
            setError(error.message || 'Failed to fetch scenarios');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await api.createScenario(formData);
            setFormData({
                name: '',
                description: '',
                model_id: modelId
            });
            setIsModalOpen(false);
            fetchScenarios();
        } catch (error) {
            setError(error.message || 'Failed to create scenario');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading && scenarios.length === 0) {
        return <div>Loading scenarios...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Scenarios</h2>
                <button 
                    className={styles.addButton}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Scenario
                </button>
            </div>

            <div className={styles.list}>
                {scenarios.map(scenario => (
                    <div key={scenario.id} className={styles.scenarioItem}>
                        <h3>{scenario.name}</h3>
                        <p>{scenario.description || 'No description'}</p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Create New Scenario</h3>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formActions}>
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScenariosList; 