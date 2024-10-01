import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import abi from '../../artifacts/contracts/RankingVotingSystem.sol/RankedVotingSystem.json';

const CONTRACT_ADDRESS = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788"; 

const CreateElection = () => {
    const [electionName, setElectionName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
            const address = await signer.getAddress()
            const nonce = await provider.getTransactionCount(address)
            const transaction = await contract.createElection(electionName,{
                nonce:nonce
            });
            await transaction.wait()
            alert('Election created successfully!');
            navigate('/admin/home'); 
        } catch (err) {
            setError('Failed to create election. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Create Event</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="electionName" className="form-label">Election Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="electionName"
                        value={electionName}
                        onChange={(e) => setElectionName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Election'}
                </button>
            </form>
        </div>
    );
};

export default CreateElection;
