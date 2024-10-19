// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        string party;  // New attribute for party name
        string area;       // New attribute for area
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public owner;  // Visibility set to public
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    event VoteCasted(address indexed voter, uint256 indexed candidateIndex);
    event CandidateAdded(string name, string party, string area); // Updated event

    constructor(string[] memory _candidateNames, string[] memory _partyNames, string[] memory _areas, uint256 _durationInMinutes) {
        require(_candidateNames.length == _partyNames.length && _partyNames.length == _areas.length, "All arrays must have the same length");

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                party: _partyNames[i],
                area: _areas[i],
                voteCount: 0
            }));
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function addCandidate(string memory _name, string memory _party, string memory _area) public onlyOwner {
        candidates.push(Candidate({
            name: _name,
            party: _party,
            area: _area,
            voteCount: 0
        }));
        emit CandidateAdded(_name, _party, _area);  // Emit the event with additional details
    }

    function vote(uint256 _candidateIndex) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
        emit VoteCasted(msg.sender, _candidateIndex);  // Emit the event
    }

    function getAllVotesOfCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    function getResults() public view returns (string memory winnerName, uint256 winnerVoteCount) {
        require(block.timestamp >= votingEnd, "Voting is still ongoing.");

        uint256 highestVotes = 0;
        uint256 winnerIndex = 0;
        bool tie = false;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > highestVotes) {
                highestVotes = candidates[i].voteCount;
                winnerIndex = i;
                tie = false;
            } else if (candidates[i].voteCount == highestVotes) {
                tie = true;
            }
        }

        if (tie) {
            return ("It's a tie!", highestVotes);
        } else {
            return (candidates[winnerIndex].name, highestVotes);
        }
    }
}


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        string party;  // Attribute for party name
        string area;   // Attribute for area
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    // To store the number of seats won by each party
    mapping(string => uint256) public partySeats;
    // To store the area-wise winner
    mapping(string => Candidate) public areaWinners;

    event VoteCasted(address indexed voter, uint256 indexed candidateIndex);
    event CandidateAdded(string name, string party, string area);

    constructor(
        string[] memory _candidateNames, 
        string[] memory _partyNames, 
        string[] memory _areas, 
        uint256 _durationInMinutes
    ) {
        require(_candidateNames.length == _partyNames.length && _partyNames.length == _areas.length, "All arrays must have the same length");

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                party: _partyNames[i],
                area: _areas[i],
                voteCount: 0
            }));
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function addCandidate(string memory _name, string memory _party, string memory _area) public onlyOwner {
        candidates.push(Candidate({
            name: _name,
            party: _party,
            area: _area,
            voteCount: 0
        }));
        emit CandidateAdded(_name, _party, _area);
    }

    function vote(uint256 _candidateIndex) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
        emit VoteCasted(msg.sender, _candidateIndex);
    }

    function getAllVotesOfCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    // Function to calculate area-wise winners
    function calculateAreaWinners() internal {
        for (uint256 i = 0; i < candidates.length; i++) {
            areaWinners[candidates[i].area] = Candidate("", "", "", 0);
        }

        for (uint256 i = 0; i < candidates.length; i++) {
            Candidate memory candidate = candidates[i];
            if (candidate.voteCount > areaWinners[candidate.area].voteCount) {
                areaWinners[candidate.area] = candidate;
            }
        }
    }

    // Function to calculate party with more than half the seats
    function calculatePartySeats() internal {
        for (uint256 i = 0; i < candidates.length; i++) {
            partySeats[candidates[i].party] = 0;
        }

        for (uint256 i = 0; i < candidates.length; i++) {
            Candidate memory winner = areaWinners[candidates[i].area];
            if (bytes(winner.name).length != 0) {
                partySeats[winner.party]++;
            }
        }
    }

    // Function to finalize results at the end of the voting
    function finalizeResults() public onlyOwner {
        require(block.timestamp >= votingEnd, "Voting is still ongoing.");
        calculateAreaWinners();
        calculatePartySeats();
    }

    // Function to get election results after finalization
    function getResults() public view returns (string memory overallWinner, string[] memory areaWinnersList) {
        require(block.timestamp >= votingEnd, "Voting is still ongoing.");

        uint256 totalSeats = candidates.length;  // Number of areas
        uint256 majoritySeats = totalSeats / 2;

        string memory winningParty = "";
        for (uint256 i = 0; i < candidates.length; i++) {
            if (partySeats[candidates[i].party] > majoritySeats) {
                winningParty = candidates[i].party;
                break;
            }
        }

        if (bytes(winningParty).length == 0) {
            overallWinner = "No party won a majority.";
        } else {
            overallWinner = string(abi.encodePacked("The winning party is: ", winningParty));
        }

        // Gather area-wise winners
        areaWinnersList = new string[](totalSeats);
        for (uint256 i = 0; i < candidates.length; i++) {
            string memory area = candidates[i].area;
            areaWinnersList[i] = string(abi.encodePacked("Area: ", area, ", Winner: ", areaWinners[area].name, ", Party: ", areaWinners[area].party));
        }

        return (overallWinner, areaWinnersList);
    }
}
