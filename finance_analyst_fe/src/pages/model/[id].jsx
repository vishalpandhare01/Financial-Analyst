import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PeriodSelect from '../../components/Period/PeriodSelect';
import ScenarioSelect from '../../components/Scenario/ScenarioSelect';
import LineItemForm from '../../components/LineItemForm';
import LineItemUpload from '../../components/LineItemUpload';
import styles from './ModelDetails.module.css';

const ModelDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'upload'

    useEffect(() => {
        const fetchModelDetails = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const response = await api.getFinanceModel(id);
                setModel(response);
            } catch (err) {
                setError('Failed to fetch model details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchModelDetails();
    }, [id]);

    const handlePeriodSelect = (period) => {
        console.log('Selected period:', period);
        setSelectedPeriod(period);
    };

    const handleScenarioSelect = (scenario) => {
        console.log('Selected scenario:', scenario);
        setSelectedScenario(scenario);
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!model) return <div className={styles.error}>Model not found</div>;

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <button 
                    className={styles.backButton}
                    onClick={() => router.back()}
                >
                    ← Back
                </button>

                <div className={styles.content}>
                    <h1>{model.name}</h1>
                    
                    <div className={styles.details}>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Version:</span>
                            <span className={styles.value}>{model.version}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Type:</span>
                            <span className={styles.value}>{model.model_type}</span>
                        </div>
                    </div>

                    <div className={styles.selectionContainer}>
                        <div className={styles.periodSection}>
                            <h2>Select Period</h2>
                            <PeriodSelect onPeriodSelect={handlePeriodSelect} selectedPeriod={selectedPeriod} />
                        </div>

                        <div className={styles.scenarioSection}>
                            <h2>Select Scenario</h2>
                            <ScenarioSelect 
                                modelId={id} 
                                onScenarioSelect={handleScenarioSelect} 
                                selectedScenario={selectedScenario}
                            />
                        </div>
                    </div>

                    {selectedPeriod && selectedScenario && (
                        <div className={styles.lineItemSection}>
                            <h2>Add Line Items</h2>
                            
                            <div className={styles.tabContainer}>
                                <div className={styles.tabButtons}>
                                    <button
                                        className={`${styles.tabButton} ${activeTab === 'manual' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('manual')}
                                    >
                                        Manual Entry
                                    </button>
                                    <button
                                        className={`${styles.tabButton} ${activeTab === 'upload' ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab('upload')}
                                    >
                                        Upload Spreadsheet
                                    </button>
                                </div>

                                <div className={styles.tabContent}>
                                    {activeTab === 'manual' ? (
                                        <LineItemForm 
                                            modelId={id}
                                            scenarioId={selectedScenario.value}
                                            periodId={selectedPeriod.value}
                                            onSuccess={() => {
                                                console.log('Line item added successfully');
                                            }}
                                        />
                                    ) : (
                                        <LineItemUpload
                                            modelId={id}
                                            scenarioId={selectedScenario.value}
                                            periodId={selectedPeriod.value}
                                            onSuccess={() => {
                                                console.log('Line items uploaded successfully');
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ModelDetails; 