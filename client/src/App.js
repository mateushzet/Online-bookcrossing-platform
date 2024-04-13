import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import HomePage from './HomePage';
import PrivateRoute from './PrivateRoute';
import Layout from './Layout';

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    <Route path="/homepage" element={
                        <PrivateRoute>
                            <Layout>
                                <HomePage />
                            </Layout>
                        </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
