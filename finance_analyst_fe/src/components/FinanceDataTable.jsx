import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ENDPOINTS } from '../config/endpoints';
import styles from './FinanceDataTable.module.css';

const FinanceDataTable = ({ modelId }) => {
    const [data, setData] = useState({
        results: [],
        count: 0,
        next: null,
        previous: null
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async (page) => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(`${ENDPOINTS.LINE_ITEMS}?page=${page}&model_id=${modelId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            setError('Failed to load data. Please try again.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (modelId) {
            fetchData(currentPage);
        }
    }, [modelId, currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Scenario</th>
                        <th>Period</th>
                    </tr>
                </thead>
                <tbody>
                    {data.results.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.category}</td>
                            <td>${parseFloat(item.amount).toFixed(2)}</td>
                            <td>{item.scenario.name}</td>
                            <td>{item.period.label}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!data.previous}
                    className={styles.paginationButton}
                >
                    Previous
                </button>
                <span className={styles.pageInfo}>
                    Page {currentPage} of {Math.ceil(data.count / 10)}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!data.next}
                    className={styles.paginationButton}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default FinanceDataTable; 