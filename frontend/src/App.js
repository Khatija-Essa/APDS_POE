// App.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from "./components/navbar";
import Home from "./components/Home";
import Register from "./components/register";
import Login from "./components/login";
import About from "./components/About";
import HowWork from "./components/HowWork";
import Payment from "./components/payment";
import EmployeeLogin from './components/employeelogin';
import EmployeeAdd from './components/employeeAdd';
import PaymentData from './components/PaymentData';
import Verified from './components/verified';
import Progress from './components/Progress';
import 'bootstrap/dist/css/bootstrap.min.css';

// Protected Route component for user routes
const UserRoute = ({ children }) => {
  const userType = localStorage.getItem("userType");
  if (!userType || userType !== "user") {
    return <Navigate to="/login" />;
  }
  return children;
};

// Protected Route component for employee routes
const EmployeeRoute = ({ children }) => {
  const userType = localStorage.getItem("userType");
  if (!userType || userType !== "employee") {
    return <Navigate to="/employee/login" />;
  }
  return children;
};

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />

          {/* Protected user routes */}
          <Route path="/about" element={
            <UserRoute>
              <About />
            </UserRoute>
          } />
          <Route path="/howWork" element={
            <UserRoute>
              <HowWork />
            </UserRoute>
          } />
          <Route path="/payment" element={
            <UserRoute>
              <Payment />
            </UserRoute>
          } />
          <Route path="/payment/progress" element={
            <UserRoute>
              <Progress />
            </UserRoute>
          } />

          {/* Protected employee routes */}
          <Route path="/employee/add" element={
            <EmployeeRoute>
              <EmployeeAdd />
            </EmployeeRoute>
          } />
          <Route path="/payment/PaymentData" element={
            <EmployeeRoute>
              <PaymentData />
            </EmployeeRoute>
          } />

          {/* Verified route */}
          <Route path="/verified" element={<Verified />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
