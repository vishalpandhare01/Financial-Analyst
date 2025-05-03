import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children, onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await api.getProfile();
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                setError(error.message || 'Failed to load profile');
                
                // Redirect to login if unauthorized
                if (error.status === 401) {
                    // Try to refresh token first
                    try {
                        await api.refreshToken();
                        // Retry profile fetch after token refresh
                        const retryData = await api.getProfile();
                        setProfile(retryData);
                        setError(null);
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        window.location.href = '/login';
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error && !profile) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>{error}</p>
                <button 
                    className={styles.retryButton}
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
                <div className={styles.profileSection}>
                    {profile && (
                        <>
                            <div className={styles.profileHeader}>
                                <h2>{profile.first_name} {profile.last_name}</h2>
                                <p className={styles.email}>{profile.email}</p>
                                <p className={styles.company}>{profile.company_name}</p>
                            </div>
                            <div className={styles.profileDetails}>
                                <p>Member since: {new Date(profile.created_at).toLocaleDateString()}</p>
                            </div>
                        </>
                    )}
                </div>
                <button className={styles.logoutButton} onClick={onLogout}>
                    Logout
                </button>
            </div>
            
            <div className={styles.mainContent}>
                <button className={styles.toggleSidebar} onClick={toggleSidebar}>
                    {isSidebarOpen ? '←' : '→'}
                </button>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout; 