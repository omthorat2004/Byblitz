// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VoterAuth{

    struct Voter {
        string name;
        string email;
        string hashedPassword; // Store hashed password instead of plain text
        bool isRegistered; // Flag to indicate if the voter is registered
    }

    mapping(address => Voter) public voter;

    function register(string memory _name,string memory _email,string memory _password) public {
        Voter memory v = Voter(_name,_email,_password,true);
        voter[msg.sender] = v;
        
    }

    function login(string memory _email,string memory _password) public view returns (bool){
         Voter memory v = voter[msg.sender];
        require(v.isRegistered, "No account exists");

       
        return (keccak256(abi.encodePacked(v.email)) == keccak256(abi.encodePacked(_email))) &&
               (keccak256(abi.encodePacked(v.hashedPassword)) == keccak256(abi.encodePacked(_password)));
    }

    function voterDetails() public view returns(Voter memory){
        return voter[msg.sender];
    }


    



}