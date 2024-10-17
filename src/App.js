import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './Constant/constant';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
// import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [canVote, setCanVote] = useState(true);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newCandidateParty, setNewCandidateParty] = useState(''); // New state for candidate party
  const [newCandidateArea, setNewCandidateArea] = useState('');

  useEffect(() => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  async function vote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

    const tx = await contractInstance.vote(number);
    await tx.wait();
    checkVotingEligibility();
  }

  async function checkVotingEligibility() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);
  }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const candidatesList = await contractInstance.getAllVotesOfCandidates();
    const formattedCandidates = candidatesList.map((candidate, index) => ({
      index,
      name: candidate.name,
      voteCount: candidate.voteCount.toNumber(),
      party: candidate.party, // Assuming party is included in the candidate object
      area: candidate.area // Assuming area is included in the candidate object
    }));
    setCandidates(formattedCandidates);
  }

  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
  }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time.toString(), 10));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      checkVotingEligibility();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected : " + address);
        setIsConnected(true);
        checkVotingEligibility();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }

  function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  function handleCandidateNameChange(e) {
    setNewCandidateName(e.target.value);
  }

  async function addCandidate() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

      const tx = await contractInstance.addCandidate(newCandidateName, newCandidateParty, newCandidateArea, { gasLimit: 500000 });
      await tx.wait();
      getCandidates(); // Refresh the list of candidates
    } catch (err) {
      console.error("Error adding candidate:", err.message);
    }
  }

  async function getResult() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

    const [winningCandidate, winningVoteCount] = await contractInstance.getResults();
    return { name: winningCandidate, voteCount: winningVoteCount.toNumber() };
  }

  function handleWalletAddressChange() {
    setIsConnected(false); // Log the user out by setting isConnected to false
    setAccount(null); // Clear the account info
  }


  return (
    <div className="App">
      {votingStatus ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            remainingTime={remainingTime}
            number={number}
            handleNumberChange={handleNumberChange}
            voteFunction={vote}
            showButton={canVote}
            addCandidate={addCandidate}
            handleCandidateNameChange={handleCandidateNameChange}
            newCandidateName={newCandidateName}
            newCandidateParty={newCandidateParty}
            setNewCandidateParty={setNewCandidateParty}
            newCandidateArea={newCandidateArea}
            setNewCandidateArea={setNewCandidateArea}
            onWalletAddressChange={handleWalletAddressChange} // Pass the new function here
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished getResult={getResult} />
      )}
    </div>
  );
}

export default App;
