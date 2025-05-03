import { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const Index = () => {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            Finance Analyst
                        </h1>
                        <p className="text-gray-600">
                            Your intelligent financial analysis platform
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white shadow-sm">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'login'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setActiveTab('register')}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'register'
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                        {activeTab === 'login' ? <Login /> : <Register />}
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-gray-500 text-sm">
                        © {new Date().getFullYear()} Finance Analyst. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
