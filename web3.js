const contractAddress = "0xB4fFE840f19173DFB1cF08F3EcB89E815b095d12"; // Test contract address
const contractABI = [
    // Replace with the actual ABI of your contract
    {
        "constant": false,
        "inputs": [],
        "name": "mintFortune",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "name": "getFortune",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
    // Add other functions and events as needed
];

let web3;
let contract;
let account;
let lastMintedTokenId;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);
            document.getElementById('status').innerText = "Wallet connected: " + account;
        } catch (error) {
            console.error("User denied account access", error);
            document.getElementById('status').innerText = "Connection failed.";
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function mintFortune() {
    try {
        await contract.methods.mintFortune().send({ from: account });
        document.getElementById('status').innerText = "Fortune minted!";
        lastMintedTokenId = await contract.methods.totalMinted().call();
        document.getElementById('shareButton').style.display = 'block';
    } catch (error) {
        console.error("Error minting fortune", error);
        document.getElementById('status').innerText = "Error minting fortune.";
    }
}

async function shareFortune() {
    try {
        const fortune = await contract.methods.getFortune(lastMintedTokenId).call();
        const shareText = `I just minted a fortune: "${fortune}" on Prompt Fortune Cookie! Check it out!`;
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(shareUrl, '_blank');
    } catch (error) {
        console.error("Error sharing fortune", error);
        document.getElementById('status').innerText = "Error sharing fortune.";
    }
}
