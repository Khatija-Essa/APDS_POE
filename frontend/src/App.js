import React from 'react';
import { Route, Routes } from 'react-router-dom';
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
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} /> 
          <Route path="/howWork" element={<HowWork />} /> 
          <Route path="/payment" element={<Payment />} />
          <Route path="/employee/login" element={<EmployeeLogin />} /> 
          <Route path="/employee/add" element={<EmployeeAdd />} />
          <Route path="/payment/PaymentData" element={<PaymentData/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
