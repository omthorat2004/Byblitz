import React from 'react';

function VoterNavbar({ account }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Voter
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <span className="nav-link active" aria-current="page">
                Wallet Address: {account}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default VoterNavbar;
