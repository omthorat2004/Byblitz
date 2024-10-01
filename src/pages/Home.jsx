import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="mb-4">Welcome to the Election System</h1>
        <p className="lead">Please select your role to proceed</p>
        
        <div className="d-flex justify-content-center mt-4">
          <Link to="/admin/login" className="btn btn-primary mx-3 px-5 py-3">
            Admin Login
          </Link>
          <Link to="/voter/login" className="btn btn-success mx-3 px-5 py-3">
            Voter Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
