// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RankedVotingSystem {
    struct Candidate {
        string name;
        string email;
        uint256 totalRank;
        uint256 voteCount;
    }

    struct Election {
        string name;
        Candidate[] candidates;
        mapping(address => bool) hasVoted;
        mapping(address => uint256[]) voterRankings;
        uint256 totalVotes;
    }

    address public admin;
    Election[] public elections;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createElection(string memory _name) public onlyAdmin {
        Election storage newElection = elections.push();
        newElection.name = _name;
        newElection.totalVotes = 0;
    }

    function addCandidate(uint256 electionId, string memory _name, string memory _email) public onlyAdmin {
        require(electionId < elections.length, "Election does not exist");
        Election storage election = elections[electionId];
        election.candidates.push(Candidate({
            name: _name,
            email: _email,
            totalRank: 0,
            voteCount: 0
        }));
    }

    function rankCandidates(uint256 electionId, uint256[] memory _rankings) public {
        require(electionId < elections.length, "Election does not exist");
        Election storage election = elections[electionId];

        require(!election.hasVoted[msg.sender], "You have already voted in this election");
        require(_rankings.length == election.candidates.length, "Ranking length must match the number of candidates");

        election.voterRankings[msg.sender] = _rankings;
        election.hasVoted[msg.sender] = true;

        for (uint256 i = 0; i < _rankings.length; i++) {
            uint256 rank = _rankings[i];
            require(rank < election.candidates.length, "Invalid rank provided");
            election.candidates[rank].totalRank += (election.candidates.length - i);
            election.candidates[rank].voteCount++;
        }

        election.totalVotes++;
    }

    function getResults(uint256 electionId) public view returns (Candidate[] memory) {
        require(electionId < elections.length, "Election does not exist");
        Election storage election = elections[electionId];

        Candidate[] memory sortedCandidates = new Candidate[](election.candidates.length);
        for (uint256 i = 0; i < election.candidates.length; i++) {
            sortedCandidates[i] = election.candidates[i];
        }

        for (uint256 i = 0; i < sortedCandidates.length; i++) {
            for (uint256 j = i + 1; j < sortedCandidates.length; j++) {
                if (sortedCandidates[i].totalRank < sortedCandidates[j].totalRank) {
                    Candidate memory temp = sortedCandidates[i];
                    sortedCandidates[i] = sortedCandidates[j];
                    sortedCandidates[j] = temp;
                }
            }
        }
        return sortedCandidates;
    }

    function getCandidate(uint256 electionId, uint256 index) public view returns (string memory name, string memory email, uint256 totalRank, uint256 voteCount) {
        require(electionId < elections.length, "Election does not exist");
        require(index < elections[electionId].candidates.length, "Candidate does not exist");

        Candidate memory candidate = elections[electionId].candidates[index];
        return (candidate.name, candidate.email, candidate.totalRank, candidate.voteCount);
    }

    function getCandidateCount(uint256 electionId) public view returns (uint256) {
        require(electionId < elections.length, "Election does not exist");
        return elections[electionId].candidates.length;
    }

    function getElectionCount() public view returns (uint256) {
        return elections.length;
    }
}
