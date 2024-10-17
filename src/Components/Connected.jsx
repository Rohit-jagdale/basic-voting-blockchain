// import React from "react";

// const Connected = (props) => {
//     return (
//         <div className="connected-container">
//             <h1 className="connected-header">You are Connected to Metamask</h1>
//             <p className="connected-account">Metamask Account: {props.account}</p>
//             <p className="connected-account">Remaining Time: {props.remainingTime}</p>
//             {props.showButton ? (
//                 <p className="connected-account">You have already voted</p>
//             ) : (
//                 <div>
//                     <input type="number" placeholder="Enter Candidate Index" value={props.number} onChange={props.handleNumberChange}></input>
//                     <br />
//                     <button className="login-button" onClick={props.voteFunction}>Vote</button>
//                 </div>
//             )}
//             <div className="scrollable-container">
//                 <div className="scrollable-content">
//                     <table id="myTable" className="candidates-table">
//                         <thead>
//                             <tr>
//                                 <th>Index</th>
//                                 <th>Candidate Name</th>
//                                 <th>Candidate Votes</th>
//                                 <th>Party Name</th> {/* New column for party name */}
//                                 <th>Area</th> {/* New column for area */}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {props.candidates.map((candidate, index) => (
//                                 <tr key={index}>
//                                     <td>{candidate.index}</td>
//                                     <td>{candidate.name}</td>
//                                     <td>{candidate.voteCount}</td>
//                                     <td>{candidate.party}</td> {/* Display party name */}
//                                     <td>{candidate.area}</td> {/* Display area */}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//             <div>
//                 {/* Form to Add a New Candidate */}
//                 {/* <form onSubmit={(e) => {e.preventDefault(); props.addCandidate();}}>
//                     <input
//                         type="text"
//                         placeholder="Enter Candidate Name"
//                         value={props.newCandidateName}
//                         onChange={props.handleCandidateNameChange}
//                         className="candidate-input"
//                     />
//                     <input
//                         type="text"
//                         placeholder="Enter Party Name"
//                         value={props.newCandidateParty}
//                         onChange={(e) => props.setNewCandidateParty(e.target.value)} // Update state for party
//                         className="candidate-input"
//                     />
//                     <input
//                         type="text"
//                         placeholder="Enter Area"
//                         value={props.newCandidateArea}
//                         onChange={(e) => props.setNewCandidateArea(e.target.value)} // Update state for area
//                         className="candidate-input"
//                     />
//                     <button type="submit" className="submit-button">
//                         Add Candidate
//                     </button>
//                 </form> */}
//             </div>
//         </div>
//     )
// }

// export default Connected;

import React from "react";
import "./connected.css";

const Connected = (props) => {
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
            <div>
                {/* Form to Add a New Candidate */}
                {/* <form onSubmit={(e) => {e.preventDefault(); props.addCandidate();}}>
                    <input
                        type="text"
                        placeholder="Enter Candidate Name"
                        value={props.newCandidateName}
                        onChange={props.handleCandidateNameChange}
                        className="candidate-input"
                    />
                    <input
                        type="text"
                        placeholder="Enter Party Name"
                        value={props.newCandidateParty}
                        onChange={(e) => props.setNewCandidateParty(e.target.value)}
                        className="candidate-input"
                    />
                    <input
                        type="text"
                        placeholder="Enter Area"
                        value={props.newCandidateArea}
                        onChange={(e) => props.setNewCandidateArea(e.target.value)}
                        className="candidate-input"
                    />
                    <button type="submit" className="submit-button">
                        Add Candidate
                    </button>
                </form> */}
            </div>
        </div>
    );
}

export default Connected;

