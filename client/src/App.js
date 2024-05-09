import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './routing/PrivateRoute';
import Layout from './components/Layout';
import ManageUsers from "./pages/ManageUsers";
import Books from "./pages/Books";
import UserProfile from './pages/UserProfile';
import BookExchange from './pages/BookExchange';
import axios from "axios";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ConfirmAccountPage from "./pages/ConfirmAccountPage";
import ExchangeOffers from "./pages/ExchangeOffers";

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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
                    <Route path="/resetPassword" element={<ResetPasswordPage />} />
                    <Route path="/confirmAccount" element={<ConfirmAccountPage />} />

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
                    <Route path="/books" element={
                        <PrivateRoute>
                            <Layout>
                                <Books />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/userProfile" element={
                        <PrivateRoute>
                            <Layout>
                                <UserProfile />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/bookExchange" element={
                        <PrivateRoute>
                            <Layout>
                                <BookExchange />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/exchangeOffers" element={
                        <PrivateRoute>
                            <Layout>
                                <ExchangeOffers />
                            </Layout>
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </div>
    );
}


export default App;