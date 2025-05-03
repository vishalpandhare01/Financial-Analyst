import { useState } from 'react';
import { api } from '../services/api';
import styles from './Register.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        company_name: '',
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
            await api.register(formData);
            window.location.href = '/?tab=login';
        } catch (error) {
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>
                    Register your account
                </h2>
                
                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && (
                        <div className={styles.errorAlert}>
                            {error}
                        </div>
                    )}
                    
                    <div className={styles.inputGroup}>
                        <input
                            name="first_name"
                            type="text"
                            required
                            className={styles.input}
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <input
                            name="last_name"
                            type="text"
                            required
                            className={styles.input}
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <input
                            name="company_name"
                            type="text"
                            required
                            className={styles.input}
                            placeholder="Company Name"
                            value={formData.company_name}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                    
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
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register; 