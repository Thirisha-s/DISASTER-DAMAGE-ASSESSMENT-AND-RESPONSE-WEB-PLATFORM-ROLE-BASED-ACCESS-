import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import GeneralHome from './pages/GeneralHome';
import ProtectedRoute from './utils/ProtectedRoute';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {
  return (
    <Router>
      {/* Toast container should be outside Routes */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<GeneralHome />} />
        
       

       <Route
  path="/admin"
  element={
    <ProtectedRoute role="admin"> {/* match the role case */}
      <>
        <AdminDashboard />
       
      </>
    </ProtectedRoute>
  }
/>


        <Route
          path="/agent"
          element={
            <ProtectedRoute role={['agent', 'relief']}>
  <AgentDashboard />
</ProtectedRoute>

          }
        />
      </Routes>
    </Router>
  );
}

export default App;


