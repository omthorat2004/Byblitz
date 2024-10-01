import { ethers } from 'ethers';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import abi from '../../artifacts/contracts/VoterAuth.sol/VoterAuth.json';

const CONTRACT_ADDRESS = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; 

function VoterLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [details, setDetails] = useState(null);
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
   
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("hELLO")
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
      
      const isValid = await contract.login(email, password);
      if (isValid) {
        const voterDetails = await contract.voterDetails();
        navigate('/voter')
      
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Invalid email or password');
      alert('Error during login. ');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login Voter</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        <Link to={'/voter/register'} className="btn btn-primary">Register</Link>
      </form>
     
    </div>
  );
}

export default VoterLogin;
