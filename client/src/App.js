
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import Dashboard from "./Dashboard";
import PrivateRoute from './PrivateRoute';

function App() {
    return (
        <div className="App">
            <Router>

                <Routes>
                    <Route path="/" element={<LoginPage/>} />
                    <Route path="/signup" element={ <SignUpPage/>} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />

                </Routes>

            </Router>
        </div>
    );
}

export default App; 