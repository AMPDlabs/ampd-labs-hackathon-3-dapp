export const contracts = {
  profileFactory: {
    address: "0xC7253663C58A28d48c46cc31B313905c36FaDe38",
    abi: [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "profileAddress", "type": "address" }, { "indexed": false, "internalType": "string", "name": "username", "type": "string" }], "name": "ProfileCreated", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "_username", "type": "string" }, { "internalType": "string", "name": "_aboutMe", "type": "string" }, { "internalType": "string[]", "name": "_socialProfiles", "type": "string[]" }], "name": "createProfile", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_username", "type": "string" }], "name": "getProfileByUsername", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getProfiles", "outputs": [{ "components": [{ "internalType": "string", "name": "username", "type": "string" }, { "internalType": "string", "name": "aboutMe", "type": "string" }, { "internalType": "string[]", "name": "socialProfiles", "type": "string[]" }, { "components": [{ "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "string", "name": "message", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "internalType": "struct Profile.Tip[]", "name": "recentTips", "type": "tuple[]" }, { "internalType": "uint256", "name": "totalTips", "type": "uint256" }, { "internalType": "uint256", "name": "created", "type": "uint256" }], "internalType": "struct Profile.ProfileDetails[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "profiles", "outputs": [{ "internalType": "contract Profile", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "usernameToProfile", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }],
  },
  profile: {
    abi: [{ "type": "constructor", "inputs": [{ "name": "_username", "type": "string", "internalType": "string" }, { "name": "_aboutMe", "type": "string", "internalType": "string" }, { "name": "_socialProfiles", "type": "string[]", "internalType": "string[]" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "addTip", "inputs": [{ "name": "_message", "type": "string", "internalType": "string" }], "outputs": [], "stateMutability": "payable" }, { "type": "function", "name": "getProfileDetails", "inputs": [], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct Profile.ProfileDetails", "components": [{ "name": "username", "type": "string", "internalType": "string" }, { "name": "aboutMe", "type": "string", "internalType": "string" }, { "name": "socialProfiles", "type": "string[]", "internalType": "string[]" }, { "name": "recentTips", "type": "tuple[]", "internalType": "struct Profile.Tip[]", "components": [{ "name": "value", "type": "uint256", "internalType": "uint256" }, { "name": "from", "type": "address", "internalType": "address" }, { "name": "message", "type": "string", "internalType": "string" }, { "name": "timestamp", "type": "uint256", "internalType": "uint256" }] }, { "name": "totalTips", "type": "uint256", "internalType": "uint256" }, { "name": "created", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "view" }, { "type": "function", "name": "owner", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "renounceOwnership", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "transferOwnership", "inputs": [{ "name": "newOwner", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "updateAboutMe", "inputs": [{ "name": "_aboutMe", "type": "string", "internalType": "string" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "withdraw", "inputs": [], "outputs": [], "stateMutability": "nonpayable" }, { "type": "event", "name": "OwnershipTransferred", "inputs": [{ "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "TipRecieved", "inputs": [{ "name": "from", "type": "address", "indexed": true, "internalType": "address" }, { "name": "message", "type": "string", "indexed": false, "internalType": "string" }], "anonymous": false }, { "type": "error", "name": "OwnableInvalidOwner", "inputs": [{ "name": "owner", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "OwnableUnauthorizedAccount", "inputs": [{ "name": "account", "type": "address", "internalType": "address" }] }, { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }],
  },
};
