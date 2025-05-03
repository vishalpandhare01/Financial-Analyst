import { ENDPOINTS } from '../config/endpoints';

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }
}

const handleResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
        throw new ApiError(
            data.message || 'Something went wrong',
            response.status,
            data
        );
    }
    
    return data;
};

const getHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

export const api = {
    async login(credentials) {
        try {
            const response = await fetch(ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: getHeaders(false),
                body: JSON.stringify(credentials)
            });

            const data = await handleResponse(response);
            
            // Store tokens
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            
            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to login. Please try again.', 500);
        }
    },

    async register(userData) {
        try {
            const response = await fetch(ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: getHeaders(false),
                body: JSON.stringify(userData)
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to register. Please try again.', 500);
        }
    },

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new ApiError('No refresh token available', 401);
            }

            const response = await fetch(ENDPOINTS.REFRESH_TOKEN, {
                method: 'POST',
                headers: getHeaders(false),
                body: JSON.stringify({ refresh: refreshToken })
            });

            const data = await handleResponse(response);
            
            // Update tokens
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            
            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to refresh token', 500);
        }
    },

    async logout() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await fetch(ENDPOINTS.LOGOUT, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify({ refresh: refreshToken })
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear tokens regardless of API call success
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },

    async getProfile() {
        try {
            const response = await fetch(ENDPOINTS.PROFILE, {
                method: 'GET',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to fetch profile', 500);
        }
    },

    async getFinanceModels(page = 1) {
        try {
            const response = await fetch(`${ENDPOINTS.FINANCE_MODELS}?page=${page}`, {
                method: 'GET',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to fetch finance models', 500);
        }
    },

    async getFinanceModel(id) {
        try {
            const response = await fetch(`${ENDPOINTS.FINANCE_MODELS}${id}/`, {
                method: 'GET',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to fetch finance model details', 500);
        }
    },

    async createFinanceModel(data) {
        try {
            const response = await fetch(ENDPOINTS.FINANCE_MODELS, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to create finance model', 500);
        }
    },

    async updateFinanceModel(id, data) {
        try {
            const response = await fetch(`${ENDPOINTS.FINANCE_MODELS}${id}/`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to update finance model', 500);
        }
    },

    async deleteFinanceModel(id) {
        try {
            const response = await fetch(`${ENDPOINTS.FINANCE_MODELS}${id}/`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to delete finance model', 500);
        }
    },

    async getPeriods() {
        try {
            const response = await fetch(ENDPOINTS.PERIODS, {
                method: 'GET',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to fetch periods', 500);
        }
    },

    async createPeriod(data) {
        try {
            const response = await fetch(ENDPOINTS.PERIODS, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to create period', 500);
        }
    },

    async updatePeriod(id, data) {
        try {
            const response = await fetch(`${ENDPOINTS.PERIODS}${id}/`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to update period', 500);
        }
    },

    async deletePeriod(id) {
        try {
            const response = await fetch(`${ENDPOINTS.PERIODS}${id}/`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to delete period', 500);
        }
    },

    async getScenarios(modelId) {
        try {
            const response = await fetch(`${ENDPOINTS.SCENARIOS}?model_id=${modelId}`, {
                method: 'GET',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to fetch scenarios', 500);
        }
    },

    async createScenario(data) {
        try {
            const response = await fetch(ENDPOINTS.SCENARIOS, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to create scenario', 500);
        }
    },

    async updateScenario(id, data) {
        try {
            const response = await fetch(`${ENDPOINTS.SCENARIOS}${id}/`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to update scenario', 500);
        }
    },

    async deleteScenario(id) {
        try {
            const response = await fetch(`${ENDPOINTS.SCENARIOS}${id}/`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            return await handleResponse(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to delete scenario', 500);
        }
    }
}; 