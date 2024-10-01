import { ethers } from 'ethers';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import abi from '../artifacts/contracts/RankingVotingSystem.sol/RankedVotingSystem.json';
import AdminPrivate from './AdminPrivate';
import AdminHome from './pages/AdminHome';
import AdminLogin from './pages/AdminLogin';
import CreateElection from './pages/CreateElection';
import EventView from './pages/EventView';
import Home from './pages/Home';
import VoteElection from './pages/VoteElection';
import VoterLogin from './pages/VoterLogin';
import VoterRegister from './pages/VoterRegister';
import VotingPage from './pages/VotingPage';
import VoterPrivate from './VoterPrivate';
const CONTRACT_ADDRESS = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788"
const App = () => {

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const onAccountsChanged =async (accounts) => {
      if (accounts.length > 0) {
       
        localStorage.clear(); 
        const signer = await provider.getSigner()

        const contract = new ethers.Contract(CONTRACT_ADDRESS,abi.abi,signer)

        const address = await contract.admin()
        if(address==accounts[0]){
          localStorage.setItem('Admin',address)
          return
        }

        localStorage.setItem('account', accounts[0]); 
      }else{
        localStorage.clear()
        Navigate('/')
      }
    };
  
    window.ethereum.on('accountsChanged', onAccountsChanged);
  
    return () => {
      window.ethereum.removeListener('accountsChanged', onAccountsChanged);
    };
  }, []);
  return (
    <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminPrivate/>}>
            <Route path='/admin/home' element={<AdminHome/>}/>
            <Route path='admin/create-event' element={<CreateElection/>}/>
            <Route path='/event/:id' element={<EventView/>}/>
          </Route>
          <Route path='/voter/register' element={<VoterRegister/>}/>
          <Route path='/voter/login' element={<VoterLogin/>}/>
          <Route element={<VoterPrivate/>}>
            <Route path='/voter' element={<VotingPage/>}/>
            <Route path='/vote/:id' element={<VoteElection/>}/>
          </Route>
        </Routes>
    </div>
  );
}

export default App;
