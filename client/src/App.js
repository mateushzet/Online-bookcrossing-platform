import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import HomePage from './pages/HomePage/HomePage';
import AdminPage from './pages/AdminPage/AdminPage';
import PrivateRoute from './routing/PrivateRoute';
import Layout from './Layout';
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import axios from "axios";

function App() {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
    return (
        <div className="App">
            <Router>
                <Routes>
                    {/* Dla strony logowania użyj prostej strony bez Layout */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    {/* Dla ścieżki /home użyj Layout z komponentem Home jako dziecko */}
                    <Route path="/" element={
                        <PrivateRoute>
                            <Layout>
                                <HomePage />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/adminPage" element={
                        <PrivateRoute isAdminRoute={true}>
                            <Layout>
                                <AdminPage />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/manageUsers" element={
                        <PrivateRoute isAdminRoute={true}>
                            <Layout>
                                <ManageUsers />
                            </Layout>
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </div>
    );
}

export default App;