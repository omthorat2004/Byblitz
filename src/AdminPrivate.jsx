import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import abi from '../artifacts/contracts/RankingVotingSystem.sol/RankedVotingSystem.json';

const CONTRACT_ADDRESS = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788"; // Replace with your deployed contract address

const AdminPrivate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);

      
        const adminAddress = await contract.admin(); 

    
        const userAddress = await signer.getAddress();

        
        if (userAddress.toLowerCase() !== adminAddress.toLowerCase()) {
          alert('You are not the admin');
          navigate('/');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error verifying admin:', error);
        alert('Error while checking admin status. Please try again.');
        navigate('/'); // Navigate out on any error
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
     <Outlet/>
     
    </div>
  );
};

export default AdminPrivate;
