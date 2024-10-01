import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import abi from '../../artifacts/contracts/RankingVotingSystem.sol/RankedVotingSystem.json';

const CONTRACT_ADDRESS = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

const EventView = () => {
    const { id } = useParams();
    const [eventDetails, setEventDetails] = useState({});
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCandidate, setNewCandidate] = useState({ name: '', email: '' });
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchEventDetails = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
            const electionCount = await contract.getElectionCount();

            if (Number(id) < electionCount) {
                const event = await contract.elections(id);
                setEventDetails({
                    name: event.name,
                });

                const candidatesArray = [];
                const candidateCount = await contract.getCandidateCount(id);
                for (let i = 0; i < candidateCount; i++) {
                    const candidate = await contract.getCandidate(id, i);
                    candidatesArray.push({
                        name: candidate.name,
                        email: candidate.email,
                        totalRank: candidate.totalRank.toString(),
                        voteCount: candidate.voteCount.toString(),
                    });
                }
                setCandidates(candidatesArray);
            }
            setLoading(false);
        };

        fetchEventDetails();
    }, [id]);

    const handleAddCandidate = async () => {
        if (newCandidate.name && newCandidate.email) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
          
            const address = await signer.getAddress()
            const nonce = await provider.getTransactionCount(address)

         
            const transaction = await contract.addCandidate(id, newCandidate.name, newCandidate.email,{
                nonce:nonce
            });
            await transaction.wait()


            const updatedCandidates = await fetchCandidates();
            setCandidates(updatedCandidates);
            setNewCandidate({ name: '', email: '' });
        }
    };

    const fetchCandidates = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
        const candidatesArray = [];
        const candidateCount = await contract.getCandidateCount(id);

        for (let i = 0; i < candidateCount; i++) {
            const candidate = await contract.getCandidate(id, i);
            candidatesArray.push({
                name: candidate.name,
                email: candidate.email,
                totalRank: candidate.totalRank.toString(),
                voteCount: candidate.voteCount.toString(),
            });
        }

        return candidatesArray;
    };

    const handleShowResults = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
        const resultsArray = await contract.getResults(id);
        setResults(resultsArray);
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="container mt-5">
            <h1>{eventDetails.name}</h1>
            <h2>Candidates</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Total Rank</th>
                        <th>Vote Count</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate, index) => (
                        <tr key={index}>
                            <td>{candidate.name}</td>
                            <td>{candidate.email}</td>
                            <td>{candidate.totalRank}</td>
                            <td>{candidate.voteCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Add Candidate</h3>
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Candidate Name"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                    className="form-control"
                />
                <input
                    type="email"
                    placeholder="Candidate Email"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                    className="form-control mt-2"
                />
                <button onClick={handleAddCandidate} className="btn btn-success mt-2">Add Candidate</button>
            </div>

            <h3>Show Results</h3>
            <button onClick={handleShowResults} className="btn btn-info">Show Results</button>

            {results.length > 0 && (
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Total Rank</th>
                            <th>Vote Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td>{result.name}</td>
                                <td>{result.totalRank.toString()}</td>
                                <td>{result.voteCount.toString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EventView;
