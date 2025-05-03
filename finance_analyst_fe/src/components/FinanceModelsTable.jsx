import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api';
import styles from './FinanceModelsTable.module.css';

const MODEL_TYPES = [
    { value: 'DCF', label: 'Discounted Cash Flow' },
    { value: 'Forecast', label: 'Forecast Model' },
    { value: 'Budget', label: 'Budgeting Model' },
    { value: 'Scenario', label: 'Scenario Analysis' },
    { value: 'CashFlow', label: 'Cash Flow Model' },
    { value: 'Valuation', label: 'Valuation Model' },
    { value: 'LBO', label: 'Leveraged Buyout Model' },
    { value: 'M&A', label: 'M&A Model' },
    { value: 'Sensitivity', label: 'Sensitivity Analysis' },
    { value: 'BreakEven', label: 'Break-Even Model' },
    { value: 'KPI', label: 'KPI Dashboard' },
    { value: '3Statement', label: '3-Statement Model' },
    { value: 'Rolling', label: 'Rolling Forecast' },
    { value: 'CapTable', label: 'Capitalization Table' },
    { value: 'MonteCarlo', label: 'Monte Carlo Simulation' },
    { value: 'IRR', label: 'Internal Rate of Return Model' },
];

const FinanceModelsTable = () => {
    const router = useRouter();
    const [models, setModels] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingModel, setEditingModel] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        version: '',
        model_type: ''
    });

    const fetchModels = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.getFinanceModels(page);
            setModels(response.results);
            setTotalPages(Math.ceil(response.count / 10));
        } catch (err) {
            setError('Failed to fetch finance models');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModels(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleEdit = (model) => {
        setEditingModel(model);
        setFormData({
            name: model.name,
            version: model.version,
            model_type: model.model_type
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this model?')) {
            try {
                await api.deleteFinanceModel(id);
                fetchModels(currentPage);
            } catch (err) {
                setError('Failed to delete model');
                console.error(err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingModel) {
                await api.updateFinanceModel(editingModel.id, formData);
            } else {
                await api.createFinanceModel(formData);
            }
            setIsModalOpen(false);
            setEditingModel(null);
            setFormData({ name: '', version: '', model_type: '' });
            fetchModels(currentPage);
        } catch (err) {
            setError('Failed to save model');
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getModelTypeLabel = (type) => {
        const modelType = MODEL_TYPES.find(t => t.value === type);
        return modelType ? modelType.label : type;
    };

    const handleRowClick = (modelId) => {
        router.push(`/model/${modelId}`);
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Finance Models</h2>
                <button 
                    className={styles.addButton}
                    onClick={() => {
                        setEditingModel(null);
                        setFormData({ name: '', version: '', model_type: '' });
                        setIsModalOpen(true);
                    }}
                >
                    <span>+</span> Add New Model
                </button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Version</th>
                        <th>Model Type</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {models.map(model => (
                        <tr 
                            key={model.id}
                            onClick={() => handleRowClick(model.id)}
                            className={styles.tableRow}
                        >
                            <td>
                                <strong>{model.name}</strong>
                            </td>
                            <td>
                                <span className={styles.versionBadge}>
                                    {model.version}
                                </span>
                            </td>
                            <td>
                                <span className={styles.modelType}>
                                    {getModelTypeLabel(model.model_type)}
                                </span>
                            </td>
                            <td>{formatDate(model.created_at)}</td>
                            <td>
                                <button 
                                    className={styles.editButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(model);
                                    }}
                                >
                                    Edit
                                </button>
                                <button 
                                    className={styles.deleteButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(model.id);
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>{editingModel ? 'Edit Model' : 'Add New Model'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter model name"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Version:</label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleInputChange}
                                    placeholder="e.g., v1.0"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Model Type:</label>
                                <select
                                    name="model_type"
                                    value={formData.model_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select a model type</option>
                                    {MODEL_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="submit">
                                    {editingModel ? 'Update' : 'Create'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
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

export default FinanceModelsTable; 