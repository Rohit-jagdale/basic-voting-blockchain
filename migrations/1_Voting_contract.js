const Contract = artifacts.require("Voting");

module.exports = function (deployer) {
    const durationInMinutes = 60; 
    deployer.deploy(Contract, durationInMinutes);
};


// const Voting = artifacts.require("Voting");

// module.exports = function (deployer) {
//     const candidateNames = ["Alice", "Bob", "Charlie"]; // List of candidate names
//     const durationInMinutes = 60; // Voting duration in minutes (set to your desired duration)
    
//     deployer.deploy(Voting, candidateNames, durationInMinutes);
// };
