import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FinanceModelsTable from '../../components/FinanceModelsTable';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    // Sample data - in a real app, this would come from your API
    const stats = [
        { title: 'Total Revenue', value: '$45,231', change: '+20.1%', trend: 'up' },
        { title: 'Active Users', value: '2,338', change: '+15.3%', trend: 'up' },
        { title: 'Pending Tasks', value: '12', change: '-2.5%', trend: 'down' },
        { title: 'Conversion Rate', value: '3.2%', change: '+4.1%', trend: 'up' }
    ];

    const handleLogout = () => {
        // Clear any stored tokens or user data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Redirect to login page
        window.location.href = '/login';
    };

    return (
        <DashboardLayout onLogout={handleLogout}>
            <div className={styles.dashboardContent}>
                <FinanceModelsTable />
            </div>
        </DashboardLayout>
    );
};

export default Dashboard; 