import { useState } from 'react';
import { api } from '../services/api';
import styles from './Login.module.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            await api.login(formData);
            window.location.href = '/dashboard';
        } catch (error) {
            setError(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>
                    Sign in to your account
                </h2>
                
                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && (
                        <div className={styles.errorAlert}>
                            {error}
                        </div>
                    )}
                    
                    <div className={styles.inputGroup}>
                        <input
                            name="email"
                            type="email"
                            required
                            className={styles.input}
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <input
                            name="password"
                            type="password"
                            required
                            className={styles.input}
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login; 