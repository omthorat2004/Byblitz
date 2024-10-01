import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import abi from '../../artifacts/contracts/RankingVotingSystem.sol/RankedVotingSystem.json';

const CONTRACT_ADDRESS = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788"; 

const AdminHome = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
            const eventCount = await contract.getElectionCount();
            const eventsArray = [];

            for (let i = 0; i < eventCount; i++) {
                const event = await contract.elections(i); 
                eventsArray.push({
                    id: i,
                    name: event.name,
                });
            }

            setEvents(eventsArray);
            setLoading(false);
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div className="container mt-5">
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <a className="navbar-brand" href="#">Admin Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin/create-event">Create Event</Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <h2>Events</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.name}</td>
                            <td>
                                <Link to={`/event/${event.id}`} className="btn btn-primary">View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminHome;
