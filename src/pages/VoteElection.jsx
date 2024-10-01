import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import abi from '../../artifacts/contracts/RankingVotingSystem.sol/RankedVotingSystem.json';

const CONTRACT_ADDRESS = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

function VoteElection() {
  const { id } = useParams(); 
  const [candidates, setCandidates] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
      const address = await signer.getAddress();
      setAccount(address);

      const candidateCount = await contract.getCandidateCount(id); // Pass the election ID
      const candidatesArray = [];

      for (let i = 0; i < candidateCount; i++) {
        const candidate = await contract.getCandidate(id, i); // Pass the election ID
        candidatesArray.push({
          name: candidate.name,
          email: candidate.email,
          totalRank: candidate.totalRank.toString(),
          voteCount: candidate.voteCount.toString(),
        });
      }

      setCandidates(candidatesArray);
      setRankings(new Array(candidatesArray.length).fill(-1)); // Initialize rankings with -1 (unranked)
    };

    fetchCandidates();
  }, [id]);

  const handleRankingChange = (index, value) => {
    const newRankings = [...rankings];
    newRankings[index] = value;
    setRankings(newRankings);
  };

  const handleVote = async () => {
    const isValidRanking = rankings.every((rank, index, arr) => {
      return arr.indexOf(rank) === index && rank >= 0 && rank < candidates.length;
    });

    if (!isValidRanking) {
      alert('Please rank all candidates with unique ranks between 0 and the total number of candidates.');
      return;
    }

    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
      const address = await signer.getAddress();
      const nonce = await provider.getTransactionCount(address);
      const transaction = await contract.rankCandidates(id, rankings, { nonce: nonce });
      await transaction.wait();

      alert('Vote submitted successfully!');
    } catch (error) {
      alert(error.reason);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Rank Candidates for Election {id}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={index}>
              <td>{candidate.name}</td>
              <td>{candidate.email}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max={candidates.length - 1}
                  value={rankings[index] >= 0 ? rankings[index] : ''}
                  onChange={(e) => handleRankingChange(index, parseInt(e.target.value))}
                  required
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleVote} className="btn btn-primary">Submit Vote</button>
    </div>
  );
}

export default VoteElection;
