
const hre = require('hardhat');

async function main() {
    const accounts = await hre.ethers.getSigners()
    const admin = accounts[0]
    const VoterAuth = await hre.ethers.getContractFactory('VoterAuth');


    const voterAuth = await VoterAuth.deploy();

    await voterAuth.waitForDeployment();
    const address = await voterAuth.getAddress()

   
    console.log("Voter Contract",address);

    const RankingVoting = await hre.ethers.getContractFactory('RankedVotingSystem',admin)
    const rankingVoting = await RankingVoting.deploy()
    await rankingVoting.waitForDeployment()
    const rankContractAddress = await rankingVoting.getAddress()
    console.log('Voting System Contract:',rankContractAddress)
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
