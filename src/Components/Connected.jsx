import React, { useEffect } from "react";
import "./connected.css";

const Connected = (props) => {
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0 || accounts[0] !== props.account) {
        props.onWalletAddressChange();
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, [props.account, props.onWalletAddressChange]);

  return (
    <div className="connected-container">
      <h1 className="connected-header">You are Connected to Metamask</h1>
      <p className="connected-account">Metamask Account: {props.account}</p>
      <p className="connected-account">Remaining Time: {Math.floor(props.remainingTime / 60)} minutes</p>
      {props.showButton ? (
        <p className="connected-account">You have already voted</p>
      ) : (
        <div>
          <input
            type="number"
            placeholder="Enter Candidate Index"
            value={props.number}
            onChange={props.handleNumberChange}
            className="candidate-input"
          />
          <button className="login-button" onClick={props.voteFunction}>Vote</button>
        </div>
      )}
      <div className="table-container">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Candidate Name</th>
              <th>Candidate Votes</th>
              <th>Party Name</th>
              <th>Area</th>
            </tr>
          </thead>
          <tbody className="scrollable-body">
            {props.candidates.map((candidate, index) => (
              <tr key={index}>
                <td>{candidate.index}</td>
                <td>{candidate.name}</td>
                <td>{candidate.voteCount}</td>
                <td>{candidate.party}</td>
                <td>{candidate.area}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Connected;
