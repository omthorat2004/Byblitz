import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import abi from '../../artifacts/contracts/VoterAuth.sol/VoterAuth.json';

const CONTRACT_ADDRESS = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; 

function VoterRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState('');
  const navigate = useNavigate()
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
    
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
      
        setAccount(address);
       
        alert('Wallet connected: ' + address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet. Please check the console for details.');
      }
    } else {
      alert('Please install MetaMask to use this feature.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      
      if (!account) {
        alert('Please connect your wallet first.');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress()

      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
      const nonce = await provider.getTransactionCount(address)
      console.log(name)
      console.log(email)
      console.log(password)
      const transaction = await contract.register(name, email, password,{
        nonce:nonce
      });
      await transaction.wait(); 
      localStorage.setItem('account',account)
      alert('Registration successful!');
      navigate('/voter')
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Error during registration. Please check the console for details.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register Voter</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="button" className="btn btn-secondary mb-3" onClick={connectWallet}>
          Connect Wallet
        </button>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
}

export default VoterRegister;
