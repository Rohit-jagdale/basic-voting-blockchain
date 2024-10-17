// import React, { useState } from "react";
// import "./Login.css"; // Import your CSS file for styling

// const Login = (props) => {
//     const [aadhar, setAadhar] = useState("");
//     const [walletId, setWalletId] = useState("");
//     const [error, setError] = useState(""); // State for error message

//     const handleAadharChange = (event) => {
//         setAadhar(event.target.value);
//     };

//     const handleWalletIdChange = (event) => {
//         setWalletId(event.target.value);
//     };

//     const handleLogin = () => {
//         if (aadhar === "" || walletId === "") {
//             setError("Both Aadhaar Number and Wallet ID are required.");
//         } else {
//             setError("");
//             props.connectWallet(aadhar, walletId);
//         }
//     };

//     return (
//         <div className="login-container">
//             <h1 className="welcome-message">Welcome to the Decentralized Voting Application</h1>
            
//             <div className="input-field">
//                 <label>Aadhaar Number:</label>
//                 <input 
//                     type="text" 
//                     value={aadhar} 
//                     onChange={handleAadharChange} 
//                     placeholder="Enter your Aadhaar number" 
//                 />
//             </div>
            
//             <div className="input-field">
//                 <label>MetaMask Wallet ID:</label>
//                 <input 
//                     type="text" 
//                     value={walletId} 
//                     onChange={handleWalletIdChange} 
//                     placeholder="Enter your MetaMask Wallet ID" 
//                 />
//             </div>

//             {error && <p className="error-message">{error}</p>} {/* Display error if fields are empty */}
            
//             <button className="login-button" onClick={handleLogin}>
//                 Login with MetaMask
//             </button>
//         </div>
//     );
// }

// export default Login;

import React, { useState } from "react";
import axios from "axios"; // Ensure axios is imported
import "./Login.css"; // Import your CSS file for styling

const Login = (props) => {
    const [aadhar, setAadhar] = useState("");
    const [walletAddress, setWalletAddress] = useState(""); // State for wallet address input
    const [citizenData, setCitizenData] = useState(null); // State to hold citizen data
    const [error, setError] = useState(""); // State for error message

    const handleAadharChange = (event) => {
        setAadhar(event.target.value);
    };

    const handleWalletAddressChange = (event) => {
        setWalletAddress(event.target.value);
    };

    const handleAadharSubmit = async () => {
        if (aadhar === "") {
            setError("Aadhaar Number is required.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:4000/user/${aadhar}`);
            setCitizenData(response.data); // Set the retrieved citizen data
            setError(""); // Clear error message
        } catch (error) {
            console.error('Error fetching citizen data:', error);
            setError("User not found or server error.");
            setCitizenData(null); // Clear citizen data if user not found
        }
    };

    const handleLogin = () => {
        if (!citizenData) {
            setError("Please fetch citizen data first.");
            return;
        }
    
        if (!aadhar || !walletAddress) {
            setError("Both Aadhaar Number and Wallet Address are required.");
            return;
        }
    
        // Check if the entered wallet address matches the citizen's wallet address
        if (walletAddress !== citizenData.walletAddress) {
            setError("The entered wallet address does not match the citizen's registered wallet address.");
            return;
        }
    
        // If validation passes, proceed with connecting the wallet
        props.connectWallet(aadhar, walletAddress);
        setError(""); // Clear error message
    };
    

    return (
        <div className="login-container">
            <h1 className="welcome-message">Welcome to the Decentralized Voting Application</h1>
            
            <div className="input-field">
                <label>Aadhaar Number:</label>
                <input 
                    type="text" 
                    value={aadhar} 
                    onChange={handleAadharChange} 
                    placeholder="Enter your Aadhaar number" 
                />
                <button onClick={handleAadharSubmit}>Fetch Citizen Data</button>
            </div>

            {error && <p className="error-message">{error}</p>} {/* Display error if fields are empty */}
            
            {citizenData && (
                <div className="citizen-data">
                    <h2>Citizen Details:</h2>
                    <p>First Name: {citizenData.firstName}</p>
                    <p>Last Name: {citizenData.lastName}</p>
                    <p>Age: {citizenData.age}</p>
                    <p>Aadhaar Number: {citizenData.adharNumber}</p>
                    <p>Fingerprint: {citizenData.fingerprint}</p>
                    <p>Area: {citizenData.area}</p>
                    {/* <p>Wallet Address: {citizenData.walletAddress}</p> */}
                </div>
            )}

            <div className="input-field">
                <label>Wallet Address:</label>
                <input 
                    type="text" 
                    value={walletAddress} 
                    onChange={handleWalletAddressChange} 
                    placeholder="Enter your wallet address" 
                />
            </div>

            <button className="login-button" onClick={handleLogin}>
                Login with MetaMask
            </button>
        </div>
    );
}

export default Login;
