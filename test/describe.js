const {expect} = require('chai')
const {ethers} = require('hardhat')

describe("VoterAuth",()=>{
    let voterAuth,account;

    beforeEach(async()=>{
        const contract = await ethers.getContractFactory('VoterAuth')
        voterAuth = await contract.deploy()
        let accounts = await ethers.getSigners()
        account = accounts[0]

        const transaction = await voterAuth.connect(account).register('Om Thorat','omthorat1005@gmail.com','pass')
        await transaction.wait()

        const result = await voterAuth.connect(account).voterDetails()
        console.log(result)
    })

    it('login',async()=>{
        const result  = await voterAuth.connect(account).login('omthorat1005@gmail.com','pass')
        expect(result).to.be.equal(true)
    })
})
