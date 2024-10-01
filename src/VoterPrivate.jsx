import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const VoterPrivate = () => {
  const [account, setAccount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const account = localStorage.getItem('account');
    
    if (account) {
      setAccount(account);
    } else {
      navigate('/voter/login');
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
  
      <Outlet />
    </div>
  );
};

export default VoterPrivate;
