import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleManageUsers = () => {
        // Tutaj logika do zarządzania użytkownikami
        console.log('Navigating to manage users');
        navigate('/manageUsers');
    };

    const handleViewReports = () => {
        // Tutaj logika do przeglądania raportów
        console.log('Navigating to view reports');
    };

    const handleSettings = () => {
        // Tutaj logika do zarządzania ustawieniami
        console.log('Navigating to settings');
    };

    return (
        <div className="main-content">
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="border rounded-lg p-4" style={{ width: '600px', height: '500px' }}>
                    <h2 className="mb-4 text-center">Admin Panel</h2>
                    <div className="text-center">
                        <button type="button" className="btn btn-info mt-3 mx-2" onClick={handleManageUsers}>Manage Users</button>
                        <button type="button" className="btn btn-warning mt-3 mx-2" onClick={handleViewReports}>View Reports</button>
                        <button type="button" className="btn btn-secondary mt-3 mx-2" onClick={handleSettings}>Settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;