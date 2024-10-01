import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({method:'eth_requestAccounts'})
        const provider = new ethers.BrowserProvider(window.ethereum);
       const accounts = await provider.listAccounts()
        console.log(accounts)
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          localStorage.setItem('adminAccount', accounts[0]); 
          localStorage.setItem('Admin',accounts[0])
          navigate('/admin/home'); 
        }
      } catch (error) {
        console.error("Error connecting to wallet", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
    }
  };

  useEffect(() => {
    const storedAccount = localStorage.getItem('Admin');
    if (storedAccount) {
      setAccount(storedAccount);
      navigate('/admin/home'); 
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Login</h2>
      <div className="text-center">
        {account ? (
          <div>
            <p>Logged in as: {account}</p>
            <button className="btn btn-primary" onClick={() => navigate('/admin/home')}>
              Go to Admin Dashboard
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
