import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import abi from '../../artifacts/contracts/RankingVotingSystem.sol/RankedVotingSystem.json';
import VoterNavbar from './VoterNavbar';

const CONTRACT_ADDRESS = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

function VotingPage() {
  const [elections, setElections] = useState([]);
  const [account, setAccount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
      const address = await signer.getAddress();
      
      setAccount(address);

      const electionCount = await contract.getElectionCount();
      const electionsArray = [];

      for (let i = 0; i < electionCount; i++) {
        const electionName = await contract.elections(i);
        electionsArray.push({
          name: electionName.name,
          id: i 
        });
      }

      setElections(electionsArray);
    };

    fetchElections();
  }, []);

  const handleViewElection = (id) => {
    navigate(`/vote/${id}`);
  };

  return (
    <div className="container mt-5">
      <VoterNavbar account={account} /> 
      <h2>Available Elections</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {elections.map((election) => (
            <tr key={election.id}>
              <td>{election.name}</td>
              <td>
                <button
                  onClick={() => handleViewElection(election.id)}
                  className="btn btn-primary"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VotingPage;
